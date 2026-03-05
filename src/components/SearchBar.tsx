'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { SearchResult } from '@/types/movie';
import { validateImdbId, isImdbId } from '@/lib/validators';

interface SearchBarProps {
  onSearch: (imdbId: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced autocomplete search
  const fetchSuggestions = useCallback(async (query: string) => {
    if (isImdbId(query) || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsFetching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.Search && data.Search.length > 0) {
        setSuggestions(data.Search.slice(0, 6));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch {
      setSuggestions([]);
    } finally {
      setIsFetching(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setValidationError('');
    setSelectedIndex(-1);

    // Debounce autocomplete
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 350);
  };

  const handleSubmit = () => {
    if (isLoading) return;
    const trimmed = input.trim();
    const validation = validateImdbId(trimmed);

    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid input');
      return;
    }

    setShowSuggestions(false);
    setValidationError('');

    // If not an ID, search by title — pick first suggestion or trigger search with title
    if (!isImdbId(trimmed) && suggestions.length > 0) {
      const firstMatch = suggestions[0];
      setInput(`${firstMatch.Title} (${firstMatch.Year})`);
      onSearch(firstMatch.imdbID);
    } else {
      onSearch(trimmed);
    }
  };

  const handleSuggestionClick = (result: SearchResult) => {
    setInput(`${result.Title} (${result.Year})`);
    setSuggestions([]);
    setShowSuggestions(false);
    setValidationError('');
    onSearch(result.imdbID);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else {
        handleSubmit();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Input wrapper */}
      <div
        className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300
          bg-cinema-card border
          ${validationError
            ? 'border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
            : 'border-cinema-border focus-within:border-cinema-gold/50 focus-within:shadow-[0_0_25px_rgba(245,197,24,0.1)]'
          }`}
      >
        {/* Search icon */}
        <svg
          className="w-5 h-5 text-cinema-muted flex-shrink-0"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Enter IMDb ID (tt0133093) or movie title..."
          className="flex-1 bg-transparent text-cinema-light text-base font-body placeholder-cinema-muted"
          disabled={isLoading}
          aria-label="Search movies"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
        />

        {/* Loading spinner inside input */}
        {isFetching && (
          <div className="w-4 h-4 border-2 border-cinema-gold/30 border-t-cinema-gold rounded-full animate-spin" />
        )}

        {/* Clear button */}
        {input && !isLoading && (
          <button
            onClick={() => {
              setInput('');
              setSuggestions([]);
              setValidationError('');
            }}
            className="text-cinema-muted hover:text-cinema-light transition-colors"
            aria-label="Clear input"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Divider */}
        <div className="w-px h-6 bg-cinema-border flex-shrink-0" />

        {/* Analyze button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-body font-medium text-sm
            transition-all duration-200
            ${isLoading || !input.trim()
              ? 'bg-cinema-border text-cinema-muted cursor-not-allowed'
              : 'bg-cinema-gold text-cinema-black hover:bg-cinema-gold-dim active:scale-95'
            }`}
          aria-label="Analyze movie"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-cinema-black/30 border-t-cinema-black rounded-full animate-spin" />
              <span>Analyzing</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Analyze</span>
            </>
          )}
        </button>
      </div>

      {/* Validation error */}
      {validationError && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5 pl-1 animate-fade-in"
           style={{ animationFillMode: 'forwards' }}>
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {validationError}
        </p>
      )}

      {/* Autocomplete dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl overflow-hidden
          border border-cinema-border glass shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          {suggestions.map((result, index) => (
            <button
              key={result.imdbID}
              onClick={() => handleSuggestionClick(result)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150
                ${index === selectedIndex ? 'bg-cinema-border' : 'hover:bg-cinema-border/60'}
                ${index !== suggestions.length - 1 ? 'border-b border-cinema-border/50' : ''}`}
            >
              {/* Thumbnail */}
              <div className="w-9 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-cinema-border">
                {result.Poster && result.Poster !== 'N/A' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={result.Poster}
                    alt={result.Title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-cinema-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-cinema-light text-sm font-medium truncate">{result.Title}</p>
                <p className="text-cinema-muted text-xs mt-0.5">{result.Year} · Movie</p>
              </div>

              <span className="text-cinema-muted text-xs font-mono flex-shrink-0">{result.imdbID}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
