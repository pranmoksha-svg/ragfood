// Seeds Upstash Vector with the enhanced_food_data.json knowledge base.
// Usage:
//   set -a && source /vercel/share/.env.project && set +a
//   node scripts/seed-upstash-vector.mjs
//
// Requires:
//   - UPSTASH_VECTOR_REST_URL
//   - UPSTASH_VECTOR_REST_TOKEN
//   - An Upstash Vector index created with a built-in embedding model
//     (mixedbread-ai/mxbai-embed-large-v1 recommended, 1024 dims).

import { Index } from "@upstash/vector";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const url = process.env.UPSTASH_VECTOR_REST_URL;
const token = process.env.UPSTASH_VECTOR_REST_TOKEN;

if (!url || !token) {
  console.error(
    "Missing UPSTASH_VECTOR_REST_URL or UPSTASH_VECTOR_REST_TOKEN env vars.",
  );
  process.exit(1);
}

const index = new Index({ url, token });

function buildText(item) {
  const parts = [
    `Name: ${item.name ?? ""}`,
    `Category: ${item.category ?? ""}`,
    `Description: ${item.description ?? ""}`,
    `Ingredients: ${(item.ingredients ?? []).join(", ")}`,
    `Cooking Method: ${item.cooking_method ?? ""}`,
    `Nutrition: ${item.nutrition ?? ""}`,
    `Cultural Background: ${item.cultural_background ?? ""}`,
    `Dietary Tags: ${(item.dietary_tags ?? []).join(", ")}`,
    `Allergens: ${(item.allergens ?? []).join(", ")}`,
  ];
  return parts.filter(Boolean).join("\n");
}

async function main() {
  const filePath = resolve(process.cwd(), "enhanced_food_data.json");
  console.log(`Reading ${filePath}...`);
  const raw = await readFile(filePath, "utf8");
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error("Expected enhanced_food_data.json to be an array.");
  }

  console.log(`Loaded ${data.length} food items.`);

  const batchSize = 50;
  let total = 0;

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize).map((item, idx) => {
      const id = item.id ?? `food_${i + idx}`;
      const text = buildText(item);
      return {
        id: String(id),
        data: text,
        metadata: {
          name: item.name,
          category: item.category,
          ingredients: item.ingredients ?? [],
          cooking_method: item.cooking_method ?? "",
          nutrition: item.nutrition ?? "",
          cultural_background: item.cultural_background ?? "",
          dietary_tags: item.dietary_tags ?? [],
          allergens: item.allergens ?? [],
        },
      };
    });

    await index.upsert(batch);
    total += batch.length;
    console.log(`Upserted ${total}/${data.length}...`);
  }

  const info = await index.info();
  console.log("Done. Index info:", info);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
