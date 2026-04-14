import os
from upstash_vector import Index
from dotenv import load_dotenv
import json
import requests

# Load environment variables
load_dotenv()

# Constants
UPSTASH_URL = os.getenv("UPSTASH_VECTOR_REST_URL")
UPSTASH_TOKEN = os.getenv("UPSTASH_VECTOR_REST_TOKEN")

# Setup Upstash Vector
index = Index(
    url = UPSTASH_URL,
    token = UPSTASH_TOKEN
)

# Load food data from JSON file
with open("foods.json", "r", encoding="utf-8") as f:
    food_data = json.load(f)

# Add only new items
response = index.query(data="", top_k=1000, include_data=True)


# Debugging: Log the response if empty
if not response or 'items' not in response or not response['items']:
    print("⚠️ Warning: The response from Upstash Vector is empty or malformed.")
    print("Response:", response)
    existing_ids = set()  # Fallback to an empty set
else:
    existing_ids = set([item['id'] for item in response['items']])

new_items = [item for item in food_data if item['id'] not in existing_ids]

if new_items:
    print(f"🆕 Adding {len(new_items)} new documents to Upstash...")
    # DELETE OLD DATA (run once)
    index.reset()
    for item in new_items:
        # Ensure 'text' exists before using it
        if 'text' in item:
            index.upsert([
                {
                "id": item["id"],
                "data": item["text"]
            }
            ])
        else:
            print(f"⚠️ Skipping item with ID {item['id']} as it lacks 'text'.")
else:
    print("✅ All documents already in Upstash Vector.")

# Replace Ollama calls with Groq API integration

def groq_generate_response(prompt):
    GROQ_API_URL = os.getenv("GROQ_API_URL")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

    # Debugging: Verify environment variables
    print("GROQ_API_URL:", GROQ_API_URL)
    print("GROQ_API_KEY:", GROQ_API_KEY)

    if not GROQ_API_URL or not GROQ_API_KEY:
        raise ValueError("GROQ_API_URL and GROQ_API_KEY must be set in the environment variables.")

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "openai/gpt-oss-120b",  # Specify the model explicitly
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 150,
        "temperature": 0.7
    }

    response = requests.post(GROQ_API_URL, headers=headers, json=payload)

    if response.status_code != 200:
        raise Exception(f"Groq API call failed with status code {response.status_code}: {response.text}")

    return response.json()["choices"][0]["message"]["content"]

# Example usage of Groq API
def rag_query(question):
    prompt = f"Answer the following question: {question}"
    response = groq_generate_response(prompt)
    print("Generated Response:", response)
    return response

# Interactive loop
print("\n🧠 RAG is ready. Ask a question (type 'exit' to quit):\n")
while True:
    question = input("You: ")
    if question.lower() in ["exit", "quit"]:
        print("👋 Goodbye!")
        break
    answer = rag_query(question)
    print("🤖:", answer)
