# Setup Guide

Complete instructions for setting up the Food AI RAG application locally and deploying to production.

---

## Prerequisites

Before starting, ensure you have:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **pnpm** (recommended) - `npm install -g pnpm`
- **Git** - [Download](https://git-scm.com/)
- **Upstash Account** - [Sign up](https://upstash.com/)
- **Groq Account** - [Sign up](https://console.groq.com/)

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/pranmoksha-svg/ragfood.git
cd ragfood
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Upstash Vector (create at console.upstash.com)
UPSTASH_VECTOR_REST_URL=https://your-index.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your_token_here

# Groq API (create at console.groq.com/keys)
GROQ_API_KEY=gsk_your_api_key_here
```

### 4. Seed the Vector Database

```bash
node --env-file=.env.local scripts/seed-upstash-vector.mjs
```

### 5. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Detailed Setup

### Creating an Upstash Vector Index

1. Go to [console.upstash.com](https://console.upstash.com/)
2. Click **Create Database** → **Vector**
3. Configure:
   - **Name:** `food-rag` (or any name)
   - **Region:** Choose closest to your users
   - **Embedding Model:** `BGE-BASE-EN-V1.5` (built-in)
   - **Dimensions:** 768 (auto-set by model)
4. Click **Create**
5. Copy the **REST URL** and **REST Token** to your `.env.local`

### Getting a Groq API Key

1. Go to [console.groq.com](https://console.groq.com/)
2. Sign in or create an account
3. Navigate to **API Keys**
4. Click **Create API Key**
5. Copy the key to your `.env.local`

---

## Seeding the Database

The food knowledge base must be loaded into Upstash Vector before the app works.

### Run the Seed Script

```bash
# Using Node.js with env file
node --env-file=.env.local scripts/seed-upstash-vector.mjs

# Or source the env file first
source .env.local && node scripts/seed-upstash-vector.mjs
```

### Expected Output

```
Loading food data...
Loaded 20 food items
Upstashing to vector index...
Upserted: greek-salad
Upserted: grilled-mediterranean-vegetables
...
Successfully seeded 20 items
Index info: { pendingVectorCount: 0, indexedVectorCount: 40 }
```

### Verify Seeding

Test with a simple query:

```bash
node --env-file=.env.local scripts/test-query.mjs "healthy food"
```

---

## Project Structure

```
ragfood/
├── app/
│   ├── actions.ts        # Server action for RAG queries
│   ├── admin/
│   │   └── page.tsx      # Analytics dashboard
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main chat page
├── components/
│   ├── chat-interface.tsx  # Chat UI component
│   ├── site-footer.tsx     # Footer component
│   ├── site-header.tsx     # Header with nav
│   ├── source-card.tsx     # Food source display
│   └── ui/                 # shadcn/ui components
├── docs/
│   ├── api.md            # API documentation
│   ├── architecture.md   # System architecture
│   └── setup.md          # This file
├── lib/
│   ├── analytics.ts      # Client-side analytics
│   ├── models.ts         # LLM model definitions
│   └── utils.ts          # Utility functions
├── scripts/
│   ├── seed-upstash-vector.mjs  # Database seeder
│   └── test-query.mjs           # Query tester
├── enhanced_food_data.json  # Food knowledge base
├── package.json
└── README.md
```

---

## Development

### Running the Dev Server

```bash
pnpm dev
```

The app runs at `http://localhost:3000` with hot reloading.

### Type Checking

```bash
pnpm exec tsc --noEmit
```

### Linting

```bash
pnpm lint
```

### Building for Production

```bash
pnpm build
```

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables:
   - `UPSTASH_VECTOR_REST_URL`
   - `UPSTASH_VECTOR_REST_TOKEN`
   - `GROQ_API_KEY`
5. Click **Deploy**

### Environment Variables in Vercel

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable for **Production**, **Preview**, and **Development**

---

## Troubleshooting

### Common Issues

#### "Upstash Vector credentials are missing"

**Cause:** Environment variables not set or not loaded.

**Solution:**
1. Verify `.env.local` exists with correct values
2. Restart the dev server
3. In production, check Vercel environment variables

#### "Unable to find relevant food information"

**Cause:** Vector database is empty or not seeded.

**Solution:**
1. Run the seed script: `node --env-file=.env.local scripts/seed-upstash-vector.mjs`
2. Verify with: `node --env-file=.env.local scripts/test-query.mjs "test"`

#### "Failed to generate response"

**Cause:** Groq API error (rate limit, invalid key, model unavailable).

**Solution:**
1. Check your Groq API key is valid
2. Verify you haven't exceeded rate limits
3. Try a different model (`llama-3.1-8b-instant`)

#### Model Selection Not Working

**Cause:** Module import issue with `lib/models.ts`.

**Solution:**
1. Hard refresh the page (Ctrl+Shift+R)
2. Clear browser cache
3. Restart the dev server

---

## Adding New Food Items

### 1. Edit the Data File

Add entries to `enhanced_food_data.json`:

```json
{
  "name": "New Dish Name",
  "category": "Category",
  "description": "Detailed description...",
  "ingredients": ["ingredient1", "ingredient2"],
  "cooking_method": "Method",
  "nutritional_benefits": "Benefits",
  "cultural_background": "Origin",
  "dietary_tags": ["vegetarian"],
  "allergens": []
}
```

### 2. Re-seed the Database

```bash
node --env-file=.env.local scripts/seed-upstash-vector.mjs
```

### 3. Test the New Data

```bash
node --env-file=.env.local scripts/test-query.mjs "New Dish Name"
```

---

## Support

- **Issues:** [GitHub Issues](https://github.com/pranmoksha-svg/ragfood/issues)
- **Documentation:** See `/docs` folder
- **Upstash Docs:** [upstash.com/docs](https://upstash.com/docs)
- **Groq Docs:** [console.groq.com/docs](https://console.groq.com/docs)
