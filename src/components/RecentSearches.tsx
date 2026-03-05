'use client';

import { useEffect, useState } from 'react';

interface RecentSearch {
  imdbId: string;
  title: string;
  year: string;
  poster: string;
}

interface RecentSearchesProps {
  onSelect: (imdbId: string) => void;
  currentImdbId?: string;
}

const STORAGE_KEY = 'cineai_recent_searches';
const MAX_RECENT = 5;

// Helper to safely interact with localStorage
function getStoredSearches(): RecentSearch[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(data: RecentSearch): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredSearches();
    const filtered = existing.filter(s => s.imdbId !== data.imdbId);
    const updated = [data, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable
  }
}

export default function RecentSearches({ onSelect, currentImdbId }: RecentSearchesProps) {
  const [searches, setSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    setSearches(getStoredSearches());
  }, [currentImdbId]); // Refresh when new search completes

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSearches([]);
  };

  if (searches.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 animate-fade-up"
         style={{ animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-cinema-muted text-xs uppercase tracking-widest">Recent searches</p>
        <button
          onClick={handleClear}
          className="text-cinema-muted text-xs hover:text-cinema-light transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {searches.map(search => (
          <button
            key={search.imdbId}
            onClick={() => onSelect(search.imdbId)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-150
              border hover:scale-105 active:scale-95
              ${search.imdbId === currentImdbId
                ? 'border-cinema-gold/50 bg-cinema-gold/10 text-cinema-gold'
                : 'border-cinema-border bg-cinema-card text-cinema-light hover:border-cinema-gold/30'
              }`}
          >
            {search.poster && search.poster !== 'N/A' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={search.poster}
                alt={search.title}
                className="w-5 h-7 object-cover rounded"
              />
            ) : (
              <div className="w-5 h-7 bg-cinema-border rounded" />
            )}
            <span className="max-w-[140px] truncate">{search.title}</span>
            <span className="text-cinema-muted text-xs">{search.year}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
