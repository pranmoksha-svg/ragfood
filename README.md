# Food AI - RAG-Powered Culinary Assistant

A full-stack AI-powered food assistant that uses Retrieval-Augmented Generation (RAG) to provide accurate, context-aware responses about food, nutrition, and cooking.

**Live Demo:** [https://ragfood-five.vercel.app/](https://ragfood-five.vercel.app/)

---

## Project Overview

### What is RAG?

Retrieval-Augmented Generation (RAG) is an AI architecture that enhances large language models by grounding their responses in retrieved context from a knowledge base. Instead of relying solely on the model's training data, RAG:

1. **Retrieves** relevant documents using semantic search
2. **Augments** the prompt with retrieved context
3. **Generates** responses grounded in factual information

This approach reduces hallucinations and enables domain-specific expertise without fine-tuning.

### About This Project

Food AI is a culinary assistant that answers questions about dishes, nutrition, ingredients, and cooking methods. It demonstrates end-to-end AI development:

- **Week 2-3:** Local Python RAG system (ChromaDB + Ollama)
- **Week 4:** Cloud migration (Upstash Vector + Groq API)
- **Week 5:** Web application (Next.js + v0.dev)

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with server actions |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Upstash Vector** | Serverless vector database with built-in embeddings |
| **Groq API** | Fast LLM inference (Llama 3.1/3.3) |
| **v0.dev** | AI-powered UI generation |
| **Vercel** | Deployment and hosting |

---

## Architecture

```
User Query
    │
    ▼
┌─────────────────────┐
│   Next.js Frontend  │
│   (Chat Interface)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Server Action     │
│  (askFoodieRag)     │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐  ┌─────────┐
│ Upstash │  │  Groq   │
│ Vector  │  │   API   │
│ Search  │  │  (LLM)  │
└────┬────┘  └────┬────┘
     │            │
     └─────┬──────┘
           │
           ▼
┌─────────────────────┐
│  Grounded Response  │
│  + Source Citations │
└─────────────────────┘
```

**Flow:**
1. User submits a food-related question
2. Server action queries Upstash Vector for relevant dishes
3. Retrieved context is sent to Groq LLM with the question
4. LLM generates a response grounded in the retrieved data
5. Response is displayed with source citations

---

## Features

### Chat Interface
- ChatGPT-style conversational UI
- Real-time responses with loading states
- Session history with localStorage persistence
- Clear chat functionality

### RAG-Based Responses
- Semantic search over 20+ food items
- Context-grounded answers with citations
- Dietary preference detection (vegetarian/vegan)

### Model Selection
- **Llama 3.1 8B Instant** - Fast responses
- **Llama 3.3 70B Versatile** - Higher quality

### Query Suggestions
- Category-based chips (Diet, Cuisine)
- Example queries for new users
- One-click query population

### Social Sharing
- WhatsApp share button
- Copy to clipboard (for Instagram)
- Native Web Share API support

### Analytics Dashboard
- Query tracking with response times
- Success rate monitoring
- Model usage breakdown
- Top queries visualization

---

## Food Database

The knowledge base contains **20+ food items** including:

### Cuisines
- Mediterranean (Greek Salad, Hummus)
- Asian (Sushi, Thai Curry, Stir Fry)
- Indian (Biryani, Dosa, Curry)
- Italian (Pasta, Pizza)
- Japanese (Ramen, Tempura)

### Categories
- Healthy options (Quinoa, Grilled Fish)
- Comfort foods (Mac and Cheese, Soup)
- High-protein (Grilled Salmon, Tofu)
- Vegetarian/Vegan options

### Metadata per Item
- Description and ingredients
- Cooking method
- Nutritional benefits
- Cultural background
- Dietary tags and allergens

---

## Example Queries

Try these in the live demo:

```
"What healthy meals are low in calories?"
"Suggest high-protein vegetarian dishes"
"What Indian foods are spicy?"
"Mediterranean diet recommendations"
"Comfort foods for a cold day"
"Which dishes are vegan-friendly?"
```

---

## Performance

| Metric | Value |
|--------|-------|
| Response Time | 1-3 seconds |
| Vector Search | ~200ms |
| LLM Generation | 0.8-2.5s |
| Success Rate | 95%+ |

### Local vs Cloud Comparison

| Metric | Local RAG | Cloud RAG |
|--------|-----------|-----------|
| Avg Response Time | 23.6s | 1.4s |
| LLM Quality Score | 0/10 | 6.4/10 |
| Scalability | Limited | Auto-scale |

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/pranmoksha-svg/ragfood.git
cd ragfood
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

Create `.env.local`:

```env
UPSTASH_VECTOR_REST_URL=your_upstash_url
UPSTASH_VECTOR_REST_TOKEN=your_upstash_token
GROQ_API_KEY=your_groq_api_key
```

### 4. Seed Database

```bash
node --env-file=.env.local scripts/seed-upstash-vector.mjs
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
ragfood/
├── app/
│   ├── actions.ts          # RAG server action
│   ├── admin/page.tsx      # Analytics dashboard
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main chat page
├── components/
│   ├── chat-interface.tsx  # Chat UI
│   ├── source-card.tsx     # Food source display
│   └── ui/                 # UI components
├── docs/
│   ├── architecture.md     # System design
│   ├── api.md              # API reference
│   └── setup.md            # Setup guide
├── lib/
│   ├── analytics.ts        # Analytics tracking
│   └── models.ts           # LLM models config
├── scripts/
│   └── seed-upstash-vector.mjs
├── python-reference/       # Original Python RAG
│   ├── rag_run.py
│   └── test.py
└── enhanced_food_data.json # Food knowledge base
```

---

## Documentation

- [Architecture](docs/architecture.md) - System design and data flow
- [API Reference](docs/api.md) - Server action and external APIs
- [Setup Guide](docs/setup.md) - Detailed installation instructions

---

## Development Journey

### Week 2-3: Local Python RAG
- ChromaDB for vector storage
- Ollama for local embeddings and LLM
- Basic CLI interface

### Week 4: Cloud Migration
- Migrated to Upstash Vector (serverless)
- Switched to Groq API (fast inference)
- 17x faster response times

### Week 5: Web Application
- Built with Next.js 15 and TypeScript
- UI generated with v0.dev
- Deployed on Vercel

---

## Credits

**Student:** Pranay Goud Yerra

**Technologies:**
- [Upstash](https://upstash.com) - Serverless vector database
- [Groq](https://groq.com) - Fast LLM inference
- [Next.js](https://nextjs.org) - React framework
- [v0.dev](https://v0.dev) - AI UI generation
- [Vercel](https://vercel.com) - Deployment platform

---

## License

MIT License - See [LICENSE](LICENSE) for details.
