'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import SearchBar from '@/components/SearchBar';
import MovieCard from '@/components/MovieCard';
import SentimentGauge from '@/components/SentimentGauge';
import SentimentDetails from '@/components/SentimentDetails';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorDisplay from '@/components/ErrorDisplay';
import RecentSearches, { saveRecentSearch } from '@/components/RecentSearches';
import { MovieData, SentimentData } from '@/types/movie';

type AppStatus = 'idle' | 'loading' | 'success' | 'error';

const DEMO_IDS = [
  { id: 'tt0133093', label: 'The Matrix' },
  { id: 'tt0111161', label: 'Shawshank' },
  { id: 'tt0468569', label: 'Dark Knight' },
  { id: 'tt0137523', label: 'Fight Club' },
];

export default function Home() {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentImdbId, setCurrentImdbId] = useState<string>('');

  // Ref-based guard: tracks the imdbID currently being fetched.
  // If handleSearch is called again with the same ID while loading,
  // it exits immediately — no duplicate API calls.
  const activeSearchRef = useRef<string | null>(null);

  const handleSearch = useCallback(async (imdbId: string) => {
    const trimmedId = imdbId.trim();

    // Block duplicate concurrent calls for the same ID
    if (activeSearchRef.current === trimmedId) return;

    activeSearchRef.current = trimmedId;
    setStatus('loading');
    setMovie(null);
    setSentiment(null);
    setError(null);
    setCurrentImdbId(trimmedId);

    // Update URL for shareable links
    const url = new URL(window.location.href);
    url.searchParams.set('id', trimmedId);
    window.history.pushState({}, '', url.toString());

    try {
      // Step 1: Fetch movie data from OMDb
      const movieRes = await fetch(`/api/movie?id=${encodeURIComponent(trimmedId)}`);
      const movieData: MovieData & { error?: string } = await movieRes.json();

      if (!movieRes.ok || movieData.error) {
        throw new Error(movieData.error || 'Failed to fetch movie details');
      }

      setMovie(movieData);
      saveRecentSearch({
        imdbId: movieData.imdbID,
        title: movieData.Title,
        year: movieData.Year,
        poster: movieData.Poster,
      });

      // Step 2: Fetch AI sentiment from Gemini (exactly one call)
      const sentimentRes = await fetch('/api/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie: movieData }),
      });

      const sentimentData: SentimentData & { error?: string } = await sentimentRes.json();

      if (!sentimentRes.ok || sentimentData.error) {
        throw new Error(sentimentData.error || 'Failed to analyze sentiment');
      }

      setSentiment(sentimentData);
      setStatus('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      setStatus('error');
      window.history.pushState({}, '', window.location.pathname);
    } finally {
      // Always release the lock when done
      activeSearchRef.current = null;
    }
  }, []);

  // Run once on mount — reads ?id= from URL for shareable links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) handleSearch(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    if (currentImdbId) handleSearch(currentImdbId);
  };

  return (
    <main className="min-h-screen px-4 pb-20">

      {/* Header */}
      <header className="max-w-5xl mx-auto pt-12 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cinema-gold flex items-center justify-center">
            <svg className="w-4 h-4 text-cinema-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
            </svg>
          </div>
          <span className="font-display text-2xl tracking-widest text-white">CINE<span className="text-cinema-gold">AI</span></span>
        </div>

        <a
          href="https://www.imdb.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cinema-muted text-xs hover:text-cinema-gold transition-colors"
        >
          Powered by IMDb data
        </a>
      </header>

      {/* Hero — shown only on idle */}
      {status === 'idle' && (
        <section className="max-w-5xl mx-auto text-center pt-12 pb-8
                            animate-fade-up"
                 style={{ animationFillMode: 'forwards' }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          bg-cinema-gold/10 border border-cinema-gold/20 text-cinema-gold
                          text-xs font-medium mb-6">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            AI-Powered Movie Analysis
          </div>

          <h2 className="font-display text-5xl md:text-7xl text-white tracking-wider leading-tight mb-4">
            DISCOVER WHAT<br />
            <span className="text-cinema-gold">AUDIENCES</span> THINK
          </h2>

          <p className="text-cinema-muted text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            Enter any IMDb movie ID or title and get instant AI-powered sentiment analysis,
            audience insights, and cinematic details.
          </p>
        </section>
      )}

      {/* Search bar — always shown */}
      <div className={`max-w-5xl mx-auto ${status !== 'idle' ? 'pt-4' : ''}`}>
        <SearchBar onSearch={handleSearch} isLoading={status === 'loading'} />

        {/* Recent searches */}
        {status !== 'loading' && (
          <RecentSearches onSelect={handleSearch} currentImdbId={currentImdbId} />
        )}

        {/* Demo suggestions — only on idle */}
        {status === 'idle' && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6
                          animate-fade-up stagger-3"
               style={{ animationFillMode: 'forwards' }}>
            <span className="text-cinema-muted text-xs">Try:</span>
            {DEMO_IDS.map(demo => (
              <button
                key={demo.id}
                onClick={() => handleSearch(demo.id)}
                className="px-3 py-1.5 text-xs rounded-full border border-cinema-border
                           text-cinema-muted hover:border-cinema-gold/40 hover:text-cinema-gold
                           transition-all duration-150"
              >
                {demo.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading state */}
      {status === 'loading' && (
        <div className="max-w-5xl mx-auto">
          <LoadingSkeleton />
        </div>
      )}

      {/* Error state */}
      {status === 'error' && error && (
        <div className="max-w-5xl mx-auto">
          <ErrorDisplay error={error} onRetry={handleRetry} />
        </div>
      )}

      {/* Success state */}
      {status === 'success' && movie && (
        <div className="max-w-5xl mx-auto">

          {/* Movie card */}
          <MovieCard movie={movie} />

          {/* Sentiment section */}
          {sentiment && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <SentimentGauge sentiment={sentiment} />
              <SentimentDetails sentiment={sentiment} />
            </div>
          )}

          {/* Share & new search row */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4
                          animate-fade-up stagger-5"
               style={{ animationFillMode: 'forwards' }}>
            <button
              onClick={() => {
                const url = `${window.location.origin}?id=${movie.imdbID}`;
                navigator.clipboard.writeText(url).then(() => {
                  alert('Link copied to clipboard!');
                });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-cinema-border
                         text-cinema-muted text-sm hover:border-cinema-gold/30 hover:text-cinema-gold
                         transition-all duration-150"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share results
            </button>

            <a
              href={`https://www.imdb.com/title/${movie.imdbID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl
                         bg-cinema-gold text-cinema-black text-sm font-medium
                         hover:bg-cinema-gold-dim transition-colors active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on IMDb
            </a>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-5xl mx-auto mt-20 pt-8 border-t border-cinema-border
                          flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-cinema-muted text-xs">
          © {new Date().getFullYear()} CineAI · Powered by OMDb API & Google Gemini
        </p>
        <p className="text-cinema-muted text-xs">
          Built with Next.js · Tailwind CSS
        </p>
      </footer>
    </main>
  );
}
