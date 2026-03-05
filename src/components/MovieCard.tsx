'use client';

import { useState } from 'react';
import { MovieData } from '@/types/movie';

interface MovieCardProps {
  movie: MovieData;
}

function RatingBadge({ source, value }: { source: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-2.5
                    rounded-xl bg-cinema-dark border border-cinema-border
                    hover:border-cinema-gold/30 transition-colors">
      <span className="text-cinema-gold font-display text-xl tracking-wide">{value}</span>
      <span className="text-cinema-muted text-xs mt-0.5 text-center leading-tight">{source}</span>
    </div>
  );
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [posterError, setPosterError] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);

  const genres = movie.Genre?.split(', ') || [];
  const actors = movie.Actors?.split(', ') || [];
  const hasPoster = movie.Poster && movie.Poster !== 'N/A' && !posterError;

  // Filter meaningful ratings
  const ratings = movie.Ratings?.filter(r => r.Value !== 'N/A') || [];
  if (movie.imdbRating && movie.imdbRating !== 'N/A') {
    // Add IMDb to front if not already present
    const hasImdb = ratings.some(r => r.Source.toLowerCase().includes('imdb'));
    if (!hasImdb) {
      ratings.unshift({ Source: 'IMDb', Value: `${movie.imdbRating}/10` });
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-10">

      {/* Main card */}
      <div className="rounded-3xl overflow-hidden border border-cinema-border
                      animate-scale-in relative"
           style={{ animationFillMode: 'forwards' }}>

        {/* Blurred poster background */}
        {hasPoster && (
          <div
            className="absolute inset-0 opacity-10 bg-cover bg-center blur-2xl scale-110"
            style={{ backgroundImage: `url(${movie.Poster})` }}
            aria-hidden="true"
          />
        )}

        <div className="relative flex flex-col md:flex-row">

          {/* Poster */}
          <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
            {hasPoster ? (
              <div className="relative w-full" style={{ paddingBottom: '148%' }}>
                {!posterLoaded && (
                  <div className="absolute inset-0 skeleton" />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={movie.Poster}
                  alt={`${movie.Title} poster`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500
                    ${posterLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setPosterLoaded(true)}
                  onError={() => setPosterError(true)}
                />
              </div>
            ) : (
              <div className="w-full md:h-full min-h-[300px] bg-cinema-dark flex flex-col items-center justify-center gap-3">
                <svg className="w-16 h-16 text-cinema-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                <span className="text-cinema-muted text-sm">No poster available</span>
              </div>
            )}
          </div>

          {/* Movie info */}
          <div className="flex-1 p-6 md:p-8 bg-cinema-card/90 backdrop-blur-sm space-y-5">

            {/* Genre tags */}
            <div className="flex flex-wrap gap-2 animate-slide-in-left stagger-1"
                 style={{ animationFillMode: 'forwards' }}>
              {genres.map(genre => (
                <span key={genre}
                  className="px-3 py-1 text-xs font-medium rounded-full
                             bg-cinema-gold/10 text-cinema-gold border border-cinema-gold/20">
                  {genre}
                </span>
              ))}
              {movie.Rated && movie.Rated !== 'N/A' && (
                <span className="px-3 py-1 text-xs font-medium rounded-full
                               bg-cinema-border text-cinema-muted border border-cinema-border">
                  {movie.Rated}
                </span>
              )}
            </div>

            {/* Title */}
            <div className="animate-fade-up stagger-1" style={{ animationFillMode: 'forwards' }}>
              <h1 className="font-display text-4xl md:text-5xl text-white tracking-wider leading-none">
                {movie.Title}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-cinema-muted text-sm">
                {movie.Year !== 'N/A' && <span>{movie.Year}</span>}
                {movie.Runtime !== 'N/A' && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-cinema-border" />
                    <span>{movie.Runtime}</span>
                  </>
                )}
                {movie.Country && movie.Country !== 'N/A' && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-cinema-border" />
                    <span>{movie.Country.split(', ')[0]}</span>
                  </>
                )}
              </div>
            </div>

            {/* Ratings row */}
            {ratings.length > 0 && (
              <div className="flex flex-wrap gap-3 animate-fade-up stagger-2"
                   style={{ animationFillMode: 'forwards' }}>
                {ratings.map(r => (
                  <RatingBadge key={r.Source} source={r.Source} value={r.Value} />
                ))}
              </div>
            )}

            {/* Plot */}
            {movie.Plot && movie.Plot !== 'N/A' && (
              <div className="animate-fade-up stagger-3" style={{ animationFillMode: 'forwards' }}>
                <p className="text-cinema-light text-sm leading-relaxed">
                  {movie.Plot}
                </p>
              </div>
            )}

            {/* Cast */}
            {actors.length > 0 && actors[0] !== 'N/A' && (
              <div className="animate-fade-up stagger-4" style={{ animationFillMode: 'forwards' }}>
                <p className="text-cinema-muted text-xs uppercase tracking-widest mb-2.5">Cast</p>
                <div className="flex flex-wrap gap-2">
                  {actors.map(actor => (
                    <span key={actor}
                      className="px-3 py-1.5 text-sm rounded-full bg-cinema-dark
                                 border border-cinema-border text-cinema-light
                                 hover:border-cinema-gold/30 transition-colors">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Director & Writer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1
                            animate-fade-up stagger-5"
                 style={{ animationFillMode: 'forwards' }}>
              {movie.Director && movie.Director !== 'N/A' && (
                <div>
                  <p className="text-cinema-muted text-xs uppercase tracking-widest mb-1">Director</p>
                  <p className="text-cinema-light text-sm">{movie.Director}</p>
                </div>
              )}
              {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                <div>
                  <p className="text-cinema-muted text-xs uppercase tracking-widest mb-1">Box Office</p>
                  <p className="text-cinema-light text-sm">{movie.BoxOffice}</p>
                </div>
              )}
              {movie.Awards && movie.Awards !== 'N/A' && (
                <div className="sm:col-span-2">
                  <p className="text-cinema-muted text-xs uppercase tracking-widest mb-1">Awards</p>
                  <p className="text-cinema-light text-sm">{movie.Awards}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
