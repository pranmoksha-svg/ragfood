import time
import csv
from rag_run import rag_query, groq_generate_response

# ------------------- TEST CASES -------------------
test_cases = [
    {
        "category": "Semantic Similarity",
        "query": "Mediterranean options"
    },
    {
        "category": "Multi-Criteria",
        "query": "spicy vegetarian Asian dishes"
    },
    {
        "category": "Nutritional",
        "query": "high-protein low-carb foods"
    },
    {
        "category": "Cultural Exploration",
        "query": "traditional comfort foods"
    },
    {
        "category": "Cooking Method",
        "query": "dishes that can be grilled"
    }
]

# ------------------- LLM EVALUATION -------------------
def evaluate_with_llm(query, answer):
    prompt = f"""

Evaluate the following answer based on:
1. Relevance to the question
2. Accuracy
3. Completeness

Give a score from 1 to 10.

Also give a short justification.

Return ONLY in this format:
Score: X
Reason: ...

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

        return score, response

    except Exception as e:
        return 0, f"Evaluation failed: {e}"


# ------------------- TEST RUNNER -------------------
def run_tests():
    results = []

    print("\n🚀 Running RAG Evaluation with LLM...\n")

    # ✅ Create CSV file (overwrite each run)
    with open("results.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Test Name", "Score", "Response Time"])

    for test in test_cases:
        query = test["query"]

        print(f"🔎 Test: {test['category']}")
        print(f"Query: {query}")

        # ⏱️ Measure response time
        start_time = time.time()
        answer = rag_query(query)
        end_time = time.time()

        response_time = round(end_time - start_time, 2)

        # 🤖 LLM evaluation
        score, feedback = evaluate_with_llm(query, answer)

        print(f"\n🤖 Answer:\n{answer}")
        print(f"\n📊 LLM Score: {score}/10")
        print(f"🧠 Evaluation:\n{feedback}")
        print(f"⏱️ Response Time: {response_time:.2f} sec")
        print("-" * 60)

        # Save results in list
        results.append({
            "category": test["category"],
            "query": query,
            "response_time": response_time,
            "score": score
        })

        # ✅ Append to CSV
        with open("results.csv", "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([test["category"], score, response_time])

    return results


# ------------------- SUMMARY -------------------
def print_summary(results):
    avg_time = sum(r["response_time"] for r in results) / len(results)
    avg_score = sum(r["score"] for r in results) / len(results)

    print("\n📈 FINAL SUMMARY")
    print("=" * 50)

    for r in results:
        print(f"{r['category']}:")
        print(f"  ⏱️ Time: {r['response_time']:.2f}s")
        print(f"  📊 Score: {r['score']:.1f}/10")
        print()

    print("🔥 Overall Performance:")
    print(f"Average Response Time: {avg_time:.2f}s")
    print(f"Average LLM Score: {avg_score:.1f}/10")


# ------------------- MAIN -------------------
if __name__ == "__main__":
    results = run_tests()
    print_summary(results)