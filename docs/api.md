# API Documentation

## Overview

This document describes the APIs used in the Food AI RAG system, including the internal server action and external service integrations.

---

## Internal Server Action

### `askFoodieRag`

The main entry point for RAG queries.

**Location:** `app/actions.ts`

**Signature:**
```typescript
async function askFoodieRag(
  question: string,
  model?: string
): Promise<RagResult>
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `question` | `string` | Yes | User's food-related question |
| `model` | `string` | No | LLM model ID (defaults to `llama-3.1-8b-instant`) |

**Response Types:**
```typescript
// Success
{
  ok: true,
  answer: string,
  sources: SourceDoc[]
}

// Error
{
  ok: false,
  error: string
}

// SourceDoc structure
{
  name: string,
  description: string,
  nutritional_benefits: string,
  dietary_tags: string[],
  similarity: number
}
```

**Example Usage:**
```typescript
const result = await askFoodieRag(
  "What vegetarian dishes are high in protein?",
  "llama-3.1-8b-instant"
);

if (result.ok) {
  console.log(result.answer);
  console.log(result.sources);
} else {
  console.error(result.error);
}
```

---

## External APIs

### Upstash Vector API

**Purpose:** Semantic search over food knowledge base

**Base URL:** `UPSTASH_VECTOR_REST_URL` (environment variable)

**Authentication:** Bearer token via `UPSTASH_VECTOR_REST_TOKEN`

#### Query Endpoint

**Method:** POST `/query-data`

**Request:**
```json
{
  "data": "user question text",
  "topK": 3,
  "includeMetadata": true,
  "includeData": true
}
```

**Response:**
```json
[
  {
    "id": "greek-salad",
    "score": 0.89,
    "data": "Greek Salad is a classic Mediterranean dish...",
    "metadata": {
      "name": "Greek Salad",
      "category": "World Cuisine",
      "description": "Greek salad is a classic...",
      "ingredients": ["tomatoes", "cucumber", "olives"],
      "cooking_method": "No-cook",
      "nutritional_benefits": "Low-carb, rich in healthy fats",
      "cultural_background": "Greek Mediterranean cuisine",
      "dietary_tags": ["vegetarian", "low-carb"],
      "allergens": ["dairy"]
    }
  }
]
```

#### Upsert Endpoint

**Method:** POST `/upsert`

**Request:**
```json
{
  "id": "unique-dish-id",
  "data": "Text to embed for semantic search",
  "metadata": {
    "name": "Dish Name",
    "category": "Category",
    ...
  }
}
```

**Response:**
```json
{
  "result": "Success"
}
```

---

### Groq API

**Purpose:** Large language model inference

**Base URL:** `https://api.groq.com/openai/v1`

**Authentication:** Bearer token via `GROQ_API_KEY`

#### Chat Completions Endpoint

**Method:** POST `/chat/completions`

**Request:**
```json
{
  "model": "llama-3.1-8b-instant",
  "messages": [
    {
      "role": "system",
      "content": "You are Foodie, a knowledgeable culinary assistant..."
    },
    {
      "role": "user",
      "content": "Context:\n[DISH 1]: Greek Salad\n...\n\nQuestion: What is healthy?"
    }
  ],
  "temperature": 0.6,
  "max_tokens": 400
}
```

**Response:**
```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "llama-3.1-8b-instant",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Based on the food database, Greek Salad is a healthy option..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 250,
    "completion_tokens": 150,
    "total_tokens": 400
  }
}
```

**Available Models:**
| Model ID | Context Window | Speed |
|----------|---------------|-------|
| `llama-3.1-8b-instant` | 128K | Fastest |
| `llama-3.3-70b-versatile` | 128K | High quality |

---

## Error Handling

### Server Action Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `"Please enter a question."` | Empty input | Provide non-empty query |
| `"Question is too long..."` | >500 chars | Shorten query |
| `"Upstash Vector credentials are missing..."` | Missing env vars | Set environment variables |
| `"Unable to find relevant food information..."` | No matches | Rephrase query |
| `"Failed to generate response..."` | LLM error | Check Groq API status |

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 400 | Bad request | Check input format |
| 401 | Unauthorized | Verify API keys |
| 429 | Rate limited | Wait and retry |
| 500 | Server error | Check logs |

---

## Rate Limits

### Upstash Vector
- Free tier: 10K queries/day
- Pro tier: Unlimited

### Groq API
- Free tier: 30 requests/minute
- Developer tier: Higher limits

---

## Code Examples

### JavaScript/TypeScript (Client)

```typescript
// Using the server action in a React component
"use client";

import { askFoodieRag } from "@/app/actions";

async function handleQuery(question: string) {
  const result = await askFoodieRag(question, "llama-3.1-8b-instant");
  
  if (result.ok) {
    return {
      answer: result.answer,
      sources: result.sources
    };
  } else {
    throw new Error(result.error);
  }
}
```

### Node.js (Seeding Script)

```javascript
// scripts/seed-upstash-vector.mjs
import { Index } from "@upstash/vector";

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

async function seedData(foods) {
  for (const food of foods) {
    await index.upsert({
      id: food.name.toLowerCase().replace(/\s+/g, "-"),
      data: buildRichText(food),
      metadata: food,
    });
  }
}
```

### cURL (Direct API)

```bash
# Query Upstash Vector
curl -X POST "$UPSTASH_VECTOR_REST_URL/query-data" \
  -H "Authorization: Bearer $UPSTASH_VECTOR_REST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": "healthy vegetarian food", "topK": 3}'

# Query Groq
curl -X POST "https://api.groq.com/openai/v1/chat/completions" \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.1-8b-instant",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```
