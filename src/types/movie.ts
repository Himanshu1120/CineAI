// Core movie data from OMDb API
export interface MovieData {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  Type: string;
  BoxOffice?: string;
  Response: string;
  Error?: string;
}

export interface Rating {
  Source: string;
  Value: string;
}

// Sentiment analysis result from Gemini
export interface SentimentData {
  sentiment: 'positive' | 'mixed' | 'negative';
  score: number; // 0–100
  summary: string;
  highlights: string[];
  criticisms: string[];
  audienceAppeal: string;
}

// Search result from OMDb search endpoint
export interface SearchResult {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface SearchResponse {
  Search: SearchResult[];
  totalResults: string;
  Response: string;
  Error?: string;
}

// Combined state for the app
export interface AppState {
  status: 'idle' | 'loading' | 'success' | 'error';
  movie: MovieData | null;
  sentiment: SentimentData | null;
  error: string | null;
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  error?: string;
}
