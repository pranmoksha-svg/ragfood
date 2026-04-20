"use server";

import { Index } from "@upstash/vector";
import Groq from "groq-sdk";

import { DEFAULT_MODEL, VALID_MODEL_IDS, type ModelId } from "@/lib/models";

export type FoodMetadata = {
  name?: string;
  category?: string;
  ingredients?: string[];
  cooking_method?: string;
  nutrition?: string;
  cultural_background?: string;
  dietary_tags?: string[];
  allergens?: string[];
};

export type SourceDoc = {
  id: string;
  score: number;
  data: string;
  metadata: FoodMetadata;
};

export type RagSuccess = {
  ok: true;
  answer: string;
  sources: SourceDoc[];
};

export type RagFailure = {
  ok: false;
  error: string;
};

export type RagResult = RagSuccess | RagFailure;

function getVectorIndex() {
  const url = process.env.UPSTASH_VECTOR_REST_URL;
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN;
  if (!url || !token) {
    throw new Error(
      "Upstash Vector credentials are missing. Please set UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN.",
    );
  }
  return new Index({ url, token });
}

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Groq API key is missing. Please set GROQ_API_KEY in your environment.",
    );
  }
  return new Groq({ apiKey });
}

function buildContext(docs: SourceDoc[]): string {
  return docs
    .map((item) => {
      const m = item.metadata ?? {};
      const ingredients = (m.ingredients ?? []).join(", ");
      const dietary = (m.dietary_tags ?? []).join(", ");
      return [
        `Name: ${m.name ?? "Unknown"}`,
        `Category: ${m.category ?? "Unknown"}`,
        "",
        `Description: ${item.data ?? ""}`,
        "",
        `Ingredients: ${ingredients}`,
        `Nutrition: ${m.nutrition ?? "N/A"}`,
        `Dietary: ${dietary}`,
      ].join("\n");
    })
    .join("\n\n");
}

function filterByDietary(docs: SourceDoc[], question: string): SourceDoc[] {
  const q = question.toLowerCase();
  if (!q.includes("vegetarian") && !q.includes("vegan")) return docs;

  const filtered = docs.filter((d) => {
    const tags = (d.metadata?.dietary_tags ?? []).map((t) => t.toLowerCase());
    if (q.includes("vegan")) return tags.includes("vegan");
    return tags.includes("vegetarian") || tags.includes("vegan");
  });

  return filtered.length > 0 ? filtered.slice(0, 3) : docs;
}

export async function askFoodieRag(
  question: string,
  model?: string,
): Promise<RagResult> {
  const trimmed = question.trim();
  if (!trimmed) {
    return { ok: false, error: "Please enter a question." };
  }
  if (trimmed.length > 500) {
    return {
      ok: false,
      error: "Question is too long. Please keep it under 500 characters.",
    };
  }

  // Validate model against allowlist; fall back to default if unknown.
  const selectedModel: ModelId =
    model && VALID_MODEL_IDS.has(model) ? (model as ModelId) : DEFAULT_MODEL;

  try {
    const index = getVectorIndex();
    const groq = getGroqClient();

    // 1. Vector search using Upstash's built-in embedding model
    const raw = await index.query({
      data: trimmed,
      topK: 3,
      includeData: true,
      includeMetadata: true,
    });

    const docs: SourceDoc[] = (raw ?? []).map((r) => ({
      id: String(r.id),
      score: typeof r.score === "number" ? r.score : 0,
      data: (r as { data?: string }).data ?? "",
      metadata: (r.metadata ?? {}) as FoodMetadata,
    }));

    if (docs.length === 0) {
      return {
        ok: true,
        answer:
          "I couldn't find any matching dishes in the knowledge base for that question. Try rephrasing or asking about ingredients, cuisines, or dietary preferences.",
        sources: [],
      };
    }

    // 2. Optional dietary filter (mirrors the Python logic)
    const filtered = filterByDietary(docs, trimmed);

    // 3. Build prompt context
    const context = buildContext(filtered);

    const prompt = `Answer the question using ONLY relevant items from the context.
Ignore any items that do not match the user's request.
Be concise, friendly, and specific. Cite dish names where helpful.

Context:
${context}

Question: ${trimmed}
Answer:`;

    // 4. Generate with Groq
    const completion = await groq.chat.completions.create({
      model: selectedModel,
      temperature: 0.7,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content:
            "You are Foodie, a helpful culinary assistant. Answer only using the provided context about dishes. If the context doesn't contain the answer, say so honestly.",
        },
        { role: "user", content: prompt },
      ],
    });

    const answer =
      completion.choices?.[0]?.message?.content?.trim() ??
      "Sorry, I couldn't generate a response.";

    return { ok: true, answer, sources: filtered };
  } catch (err) {
    console.log("[v0] RAG error:", err);
    const message =
      err instanceof Error ? err.message : "Something went wrong.";
    return { ok: false, error: message };
  }
}
