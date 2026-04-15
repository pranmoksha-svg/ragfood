import os
from upstash_vector import Index
from dotenv import load_dotenv
import json
import requests

# Load environment variables
load_dotenv()

# ------------------- CONFIG -------------------
UPSTASH_URL = os.getenv("UPSTASH_VECTOR_REST_URL")
UPSTASH_TOKEN = os.getenv("UPSTASH_VECTOR_REST_TOKEN")

GROQ_API_URL = os.getenv("GROQ_API_URL")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

MODEL = "openai/gpt-oss-120b"

# ------------------- SETUP -------------------
index = Index(
    url=UPSTASH_URL,
    token=UPSTASH_TOKEN
)

# ------------------- LOAD DATA -------------------
with open("enhanced_food_data.json", "r", encoding="utf-8") as f:
    food_data = json.load(f)

# ------------------- UPSERT (RUN ONCE) -------------------
RESET = True  # ⚠️ Set True only once, then False

if RESET:
    print("🔄 Resetting index...")
    index.reset()

    to_upsert = []

    for i, item in enumerate(food_data):

        to_upsert.append({
            "id": str(i + 1),

            # ✅ Only description is vectorized
            "data": item.get("description", ""),

            # ✅ Everything else stored as metadata
            "metadata": {
                "name": item.get("name"),
                "category": item.get("category"),
                "ingredients": item.get("ingredients", []),
                "cooking_method": item.get("cooking_method"),
                "nutrition": item.get("nutritional_benefits"),
                "cultural_background": item.get("cultural_background"),
                "dietary_tags": item.get("dietary_tags", []),
                "allergens": item.get("allergens", [])
            }
        })

    index.upsert(to_upsert)
    print(f"✅ Upserted {len(to_upsert)} documents")

else:
    print("⏩ Skipping upsert (already done)")

# ------------------- GROQ FUNCTION -------------------
def groq_generate_response(prompt):

    if not GROQ_API_URL or not GROQ_API_KEY:
        raise ValueError("Missing GROQ_API_URL or GROQ_API_KEY")

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 300
    }

    response = requests.post(GROQ_API_URL, headers=headers, json=payload)

    if response.status_code != 200:
        raise Exception(response.text)

    return response.json()["choices"][0]["message"]["content"]

# ------------------- RAG QUERY -------------------
def rag_query(question):

    # 🔍 Step 1: Retrieve relevant docs
    results = index.query(
        data=question,
        top_k=3,
        include_data=True,
        include_metadata=True
    )

    print("\n📦 Raw Results:", results)

    # 🧠 Step 2: Build context
    top_docs = []

    for item in results:
        doc = f"""
Name: {item.metadata.get('name')}
Category: {item.metadata.get('category')}

Description: {item.data}

Ingredients: {', '.join(item.metadata.get('ingredients', []))}
Nutrition: {item.metadata.get('nutrition')}
Dietary: {', '.join(item.metadata.get('dietary_tags', []))}
"""
        top_docs.append(doc.strip())

    context = "\n\n".join(top_docs)

    print("\n📚 Context:\n", context)

    # 🤖 Step 3: Prompt
    prompt = f"""
Use the following context to answer the question clearly.

Context:
{context}

Question: {question}
Answer:
"""

    # 🚀 Step 4: Generate answer
    return groq_generate_response(prompt)

# ------------------- INTERACTIVE LOOP -------------------
print("\n🧠 RAG is ready. Ask a question (type 'exit' to quit):\n")

while True:
    question = input("You: ")

    if question.lower() in ["exit", "quit"]:
        print("👋 Goodbye!")
        break

    answer = rag_query(question)
    print("\n🤖:", answer, "\n")