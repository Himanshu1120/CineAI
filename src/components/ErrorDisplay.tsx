'use client';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const isNotFound = error.toLowerCase().includes('not found') ||
                     error.toLowerCase().includes('incorrect imdb');

  const isApiKey = error.toLowerCase().includes('api key') ||
                   error.toLowerCase().includes('not configured');

  // 429 quota exceeded — most specific check, must come before isNetwork
  const isQuotaExceeded = error.toLowerCase().includes('quota') ||
                          error.toLowerCase().includes('daily ai analysis limit') ||
                          error.toLowerCase().includes('429') ||
                          error.toLowerCase().includes('too many requests');

  const isNetwork = !isQuotaExceeded && (
                    error.toLowerCase().includes('fetch') ||
                    error.toLowerCase().includes('network') ||
                    error.toLowerCase().includes('failed'));

  let title = 'Something went wrong';
  let hint = 'Please try again. If the problem persists, check your connection.';
  let showRetry = true;

  if (isNotFound) {
    title = 'Movie not found';
    hint = 'Double-check the IMDb ID format (e.g., tt0133093) or search by movie title.';
  } else if (isApiKey) {
    title = 'API not configured';
    hint = 'Make sure OMDB_API_KEY and GEMINI_API_KEY are set in your environment variables.';
    showRetry = false;
  } else if (isQuotaExceeded) {
    title = 'Daily AI limit reached';
    hint = 'Gemini 2.5 Flash free tier allows 20 requests/day. Your quota resets at midnight Pacific Time. Try again tomorrow, or search a movie you\'ve already looked up (those are cached and won\'t use quota).';
    showRetry = false;
  } else if (isNetwork) {
    title = 'Connection error';
    hint = 'Could not reach the server. Check your internet connection and try again.';
  }

  return (
    <div className="w-full max-w-xl mx-auto mt-10 animate-scale-in"
         style={{ animationFillMode: 'forwards' }}>
      <div className={`rounded-2xl border p-8 text-center ${
        isQuotaExceeded
          ? 'border-amber-500/20 bg-amber-500/5'
          : 'border-red-500/20 bg-red-500/5'
      }`}>

        {/* Icon */}
        <div className={`w-14 h-14 rounded-full border
                        flex items-center justify-center mx-auto mb-4 ${
          isQuotaExceeded
            ? 'bg-amber-500/10 border-amber-500/20'
            : 'bg-red-500/10 border-red-500/20'
        }`}>
          <svg className={`w-7 h-7 ${isQuotaExceeded ? 'text-amber-400' : 'text-red-400'}`}
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isNotFound ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : isQuotaExceeded ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            )}
          </svg>
        </div>

        <h3 className="text-white font-medium text-lg mb-2">{title}</h3>
        <p className={`text-sm mb-2 ${isQuotaExceeded ? 'text-amber-400/80' : 'text-cinema-muted'}`}>
          {error}
        </p>
        <p className="text-cinema-muted/70 text-xs mb-6 leading-relaxed">{hint}</p>

        {onRetry && showRetry && (
          <button
            onClick={onRetry}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isQuotaExceeded
                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                : 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20'
            }`}
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

