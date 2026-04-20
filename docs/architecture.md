# Architecture Documentation

## System Overview

The Food AI RAG (Retrieval-Augmented Generation) system is a full-stack application that combines vector search with large language models to provide accurate, context-aware responses about food and nutrition.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE                                 │
│                    Next.js App (React + TypeScript)                     │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          SERVER ACTION                                   │
│                      app/actions.ts (askFoodieRag)                      │
└──────────────┬─────────────────────────────────────────┬────────────────┘
               │                                         │
               ▼                                         ▼
┌──────────────────────────────┐       ┌──────────────────────────────────┐
│       UPSTASH VECTOR         │       │           GROQ API               │
│    (Vector Database)         │       │      (LLM Inference)             │
│                              │       │                                  │
│  • BGE Embeddings            │       │  • Llama 3.1 8B Instant          │
│  • Semantic Search           │       │  • Llama 3.3 70B Versatile       │
│  • Metadata Filtering        │       │  • Fast Inference                │
└──────────────────────────────┘       └──────────────────────────────────┘
               │                                         │
               └─────────────────┬───────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         RESPONSE GENERATION                              │
│            Context-grounded answer with source citations                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. Frontend Layer

**Technology:** Next.js 15+ with React and TypeScript

**Key Components:**
- `app/page.tsx` - Main chat page
- `components/chat-interface.tsx` - Interactive chat UI with session management
- `components/source-card.tsx` - Displays retrieved food sources
- `components/site-header.tsx` - Navigation with analytics link

**Features:**
- Real-time chat interface
- Session history with localStorage persistence
- Model selection (8B instant vs 70B versatile)
- Social sharing (WhatsApp, clipboard)
- Query suggestions by category and cuisine

---

### 2. Server Actions Layer

**File:** `app/actions.ts`

**Function:** `askFoodieRag(question: string, model?: string)`

**Process:**
1. Validate input (trim, length check)
2. Detect dietary preferences (vegetarian/vegan keywords)
3. Query Upstash Vector with semantic search
4. Build context from retrieved documents
5. Send prompt to Groq LLM
6. Return structured response with sources

**Input Validation:**
- Maximum 500 characters
- Empty string rejection
- Model allowlist validation

---

### 3. Vector Database (Upstash Vector)

**Configuration:**
- Built-in BGE embedding model
- REST API with token authentication
- Serverless auto-scaling

**Data Structure:**
```typescript
{
  id: string,
  data: string,           // Rich text for embedding
  metadata: {
    name: string,
    category: string,
    description: string,
    ingredients: string[],
    cooking_method: string,
    nutritional_benefits: string,
    cultural_background: string,
    dietary_tags: string[],
    allergens: string[]
  }
}
```

**Query Parameters:**
- `topK: 3` - Number of results
- `includeMetadata: true` - Return full document data
- `includeData: true` - Include embedding source

---

### 4. LLM Integration (Groq API)

**Available Models:**
| Model ID | Description | Use Case |
|----------|-------------|----------|
| `llama-3.1-8b-instant` | Fast, lightweight | Quick responses |
| `llama-3.3-70b-versatile` | High quality | Detailed answers |

**Prompt Structure:**
```
System: You are Foodie, a knowledgeable culinary assistant...

Context:
[DISH 1]: Name
Description: ...
Ingredients: ...
...

Question: {user_question}
```

**Parameters:**
- `temperature: 0.6` - Balanced creativity
- `max_tokens: 400` - Concise responses

---

### 5. Analytics Layer

**File:** `lib/analytics.ts`

**Storage:** localStorage (client-side)

**Tracked Metrics:**
- Query text
- Timestamp
- Response time (ms)
- Success/failure status
- Model used

**Dashboard:** `/admin` route with:
- Total queries
- Success rate
- Average response time
- Queries by day chart
- Top queries list
- Model usage breakdown

---

## Data Flow

### Query Processing Flow

1. **User Input** → Chat interface captures question
2. **Client Validation** → Check for empty/long input
3. **Server Action** → `askFoodieRag()` called
4. **Vector Search** → Upstash returns top 3 matches
5. **Context Building** → Format retrieved docs
6. **LLM Generation** → Groq produces answer
7. **Response** → Return answer + sources
8. **UI Update** → Display in chat thread
9. **Analytics** → Track query metrics

### Session Management Flow

1. **Load** → Read sessions from localStorage on mount
2. **Create** → New session on "New Chat" click
3. **Switch** → Change active session
4. **Save** → Persist to localStorage on change
5. **Delete** → Remove session, create new if empty

---

## Security Considerations

- **Environment Variables:** API keys stored server-side only
- **Input Sanitization:** Query length limits, trim whitespace
- **Model Allowlist:** Only approved models can be selected
- **No PII Storage:** Analytics stores queries, not user data

---

## Performance Optimizations

- **Serverless Functions:** Auto-scaling with Vercel
- **Vector Search:** Sub-second retrieval with Upstash
- **Streaming:** Could be added for real-time response
- **Caching:** Session history in localStorage
- **Lazy Loading:** Components loaded as needed

---

## Scalability

The architecture supports horizontal scaling:

- **Frontend:** Vercel Edge Network
- **Vector DB:** Upstash serverless (auto-scales)
- **LLM:** Groq API (rate-limited by plan)
- **Storage:** No persistent server state required
