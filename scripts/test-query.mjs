import { Index } from "@upstash/vector"
import Groq from "groq-sdk"

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
})

const question = process.argv[2] || "What is a good high-protein vegetarian dish?"
console.log("Q:", question)

const results = await index.query({ data: question, topK: 3, includeMetadata: true })
console.log("Top hits:")
for (const r of results) {
  console.log(" -", r.metadata?.name, "| score:", r.score?.toFixed(3))
}

const context = results.map((r, i) => `Dish ${i + 1}: ${r.metadata?.text}`).join("\n\n---\n\n")

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const completion = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  temperature: 0.3,
  max_tokens: 400,
  messages: [
    {
      role: "system",
      content:
        "You are a helpful food assistant. Answer ONLY from the provided context. If the answer isn't present, say so.",
    },
    { role: "user", content: `CONTEXT:\n${context}\n\nQUESTION: ${question}` },
  ],
})
console.log("\nAnswer:\n", completion.choices[0]?.message?.content)
