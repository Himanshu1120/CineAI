import { MovieData, SearchResponse } from '@/types/movie';

const OMDB_BASE_URL = 'https://www.omdbapi.com/';

/**
 * Fetches full movie details by IMDb ID from OMDb API.
 * Called server-side only (in API route) to protect API key.
 */
export async function fetchMovieById(imdbId: string): Promise<MovieData> {
  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) {
    throw new Error('OMDB_API_KEY is not configured. Please check your .env.local file.');
  }

  const url = `${OMDB_BASE_URL}?i=${encodeURIComponent(imdbId)}&plot=short&apikey=${apiKey}`;

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`OMDb API request failed with status: ${response.status}`);
  }

  const data: MovieData = await response.json();

  // OMDb returns Response: "False" for not-found movies
  if (data.Response === 'False') {
    throw new Error(data.Error || 'Movie not found. Please check the IMDb ID.');
  }

  return data;
}

/**
 * Searches movies by title from OMDb API.
 * Returns up to 10 results for autocomplete suggestions.
 */
export async function searchMoviesByTitle(query: string): Promise<SearchResponse> {
  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) {
    throw new Error('OMDB_API_KEY is not configured.');
  }

  const url = `${OMDB_BASE_URL}?s=${encodeURIComponent(query)}&type=movie&apikey=${apiKey}`;

  const response = await fetch(url, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    throw new Error(`OMDb search request failed with status: ${response.status}`);
  }

  const data: SearchResponse = await response.json();
  return data;
}
