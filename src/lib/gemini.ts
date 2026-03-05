import { GoogleGenerativeAI } from '@google/generative-ai';
import { SentimentData, MovieData } from '@/types/movie';

/**
 * Persistent sentiment cache — survives across requests in the same server process.
 * Key = imdbID, Value = cached SentimentData.
 *
 * WHY: Gemini 2.5 Flash free tier allows only 20 requests/day.
 * Caching ensures each unique movie only ever calls Gemini ONCE,
 * no matter how many users search for the same film.
 */
const sentimentCache = new Map<string, SentimentData>();

/**
 * In-flight deduplication — if two requests for the same movie arrive
 * simultaneously, only ONE Gemini call fires; the second waits for the first.
 */
const inFlightRequests = new Map<string, Promise<SentimentData>>();

/**
 * Analyzes audience sentiment using Gemini 2.5 Flash.
 * - Returns cached result if available (no API call used)
 * - Deduplicates concurrent calls for same movie
 * - Throws descriptive error on 429 quota exceeded
 */
export async function analyzeMovieSentiment(movie: MovieData): Promise<SentimentData> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Please check your .env.local file.');
  }

  // ✅ Cache hit — return immediately, zero API calls used
  if (sentimentCache.has(movie.imdbID)) {
    return sentimentCache.get(movie.imdbID)!;
  }

  // ✅ In-flight dedup — reuse existing promise, don't fire second request
  if (inFlightRequests.has(movie.imdbID)) {
    return inFlightRequests.get(movie.imdbID)!;
  }

  const requestPromise = callGemini(apiKey, movie)
    .then((result) => {
      // Store in cache on success
      sentimentCache.set(movie.imdbID, result);
      return result;
    })
    .finally(() => {
      inFlightRequests.delete(movie.imdbID);
    });

  inFlightRequests.set(movie.imdbID, requestPromise);
  return requestPromise;
}

async function callGemini(apiKey: string, movie: MovieData): Promise<SentimentData> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are an expert film critic and audience sentiment analyst.

Analyze audience sentiment for this movie:

Title: ${movie.Title}
Year: ${movie.Year}
Genre: ${movie.Genre}
Director: ${movie.Director}
Actors: ${movie.Actors}
Plot: ${movie.Plot}
IMDb Rating: ${movie.imdbRating}/10 (${movie.imdbVotes} votes)
Metascore: ${movie.Metascore}
Awards: ${movie.Awards}
Ratings: ${movie.Ratings.map((r) => `${r.Source}: ${r.Value}`).join(', ')}

Respond ONLY with a valid JSON object, no markdown, no backticks, no extra text:
{
  "sentiment": "positive",
  "score": 85,
  "summary": "2-3 sentence description of overall audience sentiment",
  "highlights": ["strength 1", "strength 2", "strength 3"],
  "criticisms": ["criticism 1"],
  "audienceAppeal": "One sentence about who this film appeals to most"
}

Rules:
- "sentiment": exactly "positive", "mixed", or "negative"
- "score": integer 0-100
- "highlights": 2-4 items, each under 10 words
- "criticisms": 1-3 items, each under 10 words (use [] if overwhelmingly positive)`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleaned = text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    const parsed: SentimentData = JSON.parse(cleaned);

    if (!['positive', 'mixed', 'negative'].includes(parsed.sentiment)) {
      throw new Error('Invalid sentiment value in Gemini response');
    }
    if (typeof parsed.score !== 'number' || parsed.score < 0 || parsed.score > 100) {
      throw new Error('Invalid score value in Gemini response');
    }

    return parsed;
  } catch (error) {
    // Detect 429 quota exceeded — throw specific message for the API route to handle
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('too many requests')) {
      throw new Error('QUOTA_EXCEEDED: Daily AI analysis limit reached (20 req/day on free tier). Please try again tomorrow or upgrade your Gemini plan.');
    }
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse AI response. Please try again.');
    }
    throw error;
  }
}

