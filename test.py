import time
import csv
from rag_run import rag_query


# ------------------- TEST CASES -------------------
test_cases = [
    {"category": "Semantic Similarity", "query": "Mediterranean options"},
    {"category": "Multi-Criteria", "query": "spicy vegetarian Asian dishes"},
    {"category": "Nutritional", "query": "high-protein low-carb foods"},
    {"category": "Cultural Exploration", "query": "traditional comfort foods"},
    {"category": "Cooking Method", "query": "dishes that can be grilled"}
]

# ------------------- LLM EVALUATION -------------------
def evaluate_with_llm(query, answer):
    prompt = f"""
Evaluate the following answer based on:
1. Relevance
2. Accuracy
3. Completeness

Give a score from 1 to 10.

Return ONLY:
Score: X

Question: {query}
Answer: {answer}
"""

    try:
        response = groq_generate_response(prompt)

        score = 0
        for line in response.split("\n"):
            if "Score" in line:
                score = float(line.split(":")[1].strip())
                break

        return score

    except:
        return 0


# ------------------- TEST RUNNER -------------------
def run_tests():
    results = []

    print("\n🚀 Running LOCAL RAG Evaluation...\n")

    # ✅ Create CSV (overwrite each run)
    with open("local_results.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Test Name", "Score", "Response Time"])

    for test in test_cases:
        query = test["query"]

        print(f"🔎 {test['category']}")
        print(f"Query: {query}")

        # ⏱️ Measure time
        start = time.time()
        answer = rag_query(query)
        end = time.time()

        response_time = round(end - start, 2)

        # 🤖 Evaluate
        score = evaluate_with_llm(query, answer)

        print(f"Score: {score}/10")
        print(f"Time: {response_time}s")
        print("-" * 50)

        # Save
        results.append({
            "category": test["category"],
            "score": score,
            "time": response_time
        })

        # Write to CSV
        with open("local_results.csv", "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([test["category"], score, response_time])

    return results


# ------------------- SUMMARY -------------------
def print_summary(results):
    avg_time = sum(r["time"] for r in results) / len(results)
    avg_score = sum(r["score"] for r in results) / len(results)

    print("\n📈 LOCAL RAG SUMMARY")
    print("=" * 40)
    print(f"Average Time: {avg_time:.2f}s")
    print(f"Average Score: {avg_score:.2f}/10")


# ------------------- MAIN -------------------
if __name__ == "__main__":
    results = run_tests()
    print_summary(results)