# 🎬 CineAI — AI Movie Insight Builder

A cinematic, AI-powered movie analysis tool built with Next.js, Tailwind CSS, and Google Gemini.

Enter any IMDb movie ID or movie title and get instant AI-generated audience sentiment analysis, cast details, ratings, and deep cinematic insights.

---

## ✨ Features

- **IMDb ID or Title Search** — search by `tt0133093` or type a movie name with autocomplete
- **Movie Details** — poster, title, cast, genre, director, plot, runtime, box office
- **Ratings** — IMDb, Rotten Tomatoes, Metacritic in one view
- **AI Sentiment Analysis** — Gemini 2.5 Flash analyzes audience reception and returns:
  - Sentiment classification (Positive / Mixed / Negative)
  - Score gauge (0–100) with smooth animation
  - Summary paragraph
  - What audiences love + common criticisms
- **Recent Searches** — last 5 searches saved locally, one-click revisit
- **Shareable URLs** — results linked via `?id=tt0133093` query parameter
- **Responsive Design** — works on mobile, tablet, and desktop
- **Loading Skeletons** — premium shimmer skeletons (not spinners)
- **Graceful Error Handling** — specific messages for not-found, API errors, network failures

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- OMDb API key (free)
- Gemini API key (free)

### Step 1: Clone / Extract the project

```bash
# If cloned from git:
git clone <repo-url>
cd ai-movie-insight

# If extracted from zip:
cd ai-movie-insight
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Configure API Keys

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and fill in your keys:

```env
OMDB_API_KEY=your_omdb_key_here
GEMINI_API_KEY=your_gemini_key_here
```

**Getting your API keys:**

- **OMDb API** (free, 1000 req/day):
  1. Go to [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
  2. Choose "FREE" tier → enter your email
  3. Verify email → your key arrives instantly

- **Gemini API** (free):
  1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
  2. Click "Create API Key"
  3. Copy the key

### Step 4: Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 5: Run tests (optional)

```bash
npm test
```

---

## 📁 Project Structure

```
ai-movie-insight/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── movie/route.ts        # GET /api/movie?id= — fetches OMDb data
│   │   │   ├── sentiment/route.ts    # POST /api/sentiment — Gemini analysis
│   │   │   └── search/route.ts       # GET /api/search?q= — title autocomplete
│   │   ├── globals.css               # Global styles, fonts, animations
│   │   ├── layout.tsx                # Root HTML layout + metadata
│   │   └── page.tsx                  # Main app page (client component)
│   ├── components/
│   │   ├── SearchBar.tsx             # Input + autocomplete dropdown
│   │   ├── MovieCard.tsx             # Movie details display
│   │   ├── SentimentGauge.tsx        # Animated circular score gauge
│   │   ├── SentimentDetails.tsx      # Highlights & criticisms list
│   │   ├── LoadingSkeleton.tsx       # Shimmer loading placeholders
│   │   ├── ErrorDisplay.tsx          # Contextual error messages
│   │   └── RecentSearches.tsx        # localStorage recent searches
│   ├── lib/
│   │   ├── omdb.ts                   # OMDb API helper functions
│   │   ├── gemini.ts                 # Gemini AI integration
│   │   └── validators.ts             # Input validation & sanitization
│   ├── types/
│   │   └── movie.ts                  # TypeScript interfaces
│   └── __tests__/
│       ├── validators.test.ts        # Unit tests for validation logic
│       └── components.test.tsx       # Component render tests
├── .env.local.example                # Template for environment variables
├── next.config.js                    # Next.js config (image domains)
├── tailwind.config.ts                # Custom Tailwind theme
├── tsconfig.json
└── package.json
```

---

## 🛠 Tech Stack Rationale

| Technology | Reason |
|---|---|
| **Next.js 14** | API routes eliminate need for separate backend, keeping API keys server-side. App Router gives clean file-based routing. |
| **TypeScript** | Type safety across API responses and component props catches bugs at compile time, not runtime. |
| **Tailwind CSS** | Rapid, consistent styling without CSS files. Custom design tokens via `tailwind.config.ts`. |
| **Google Gemini 2.5 Flash** | Free tier is generous. Flash model is fast for structured JSON output. Better sentiment analysis than simpler models. |
| **OMDb API** | Free tier (1000 req/day) is sufficient. Returns all required movie fields in one request. |

---

## 🔑 Assumptions

1. **Sentiment is AI-generated** from Gemini's training knowledge (not live-scraped reviews). This avoids IMDb's bot-detection and TOS issues while producing high-quality, consistent analysis.

2. **IMDb IDs** are assumed to follow the `tt` + 7-8 digits format. IDs with fewer digits will show a validation error.

3. **Poster images** are fetched directly from OMDb's Amazon CDN. If a movie has no poster, a placeholder is shown.

4. **localStorage** is used for recent searches — this means searches persist per-browser, not per-account.

5. **Rate limiting** is not implemented client-side since OMDb's 1000/day free limit is sufficient for development and demo purposes.

---

## 🚢 Deployment (Vercel)

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. In Vercel dashboard → Settings → Environment Variables, add:
   - `OMDB_API_KEY`
   - `GEMINI_API_KEY`
4. Deploy — done!

---

## 📝 License

Built for Brew Full-Stack Developer Internship Assignment · Round 1
