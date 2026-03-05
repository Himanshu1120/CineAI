'use client';

export default function LoadingSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto mt-10 animate-fade-in"
         style={{ animationFillMode: 'forwards' }}>

      {/* Hero section skeleton */}
      <div className="rounded-3xl overflow-hidden border border-cinema-border bg-cinema-card">
        <div className="flex flex-col md:flex-row gap-0">

          {/* Poster skeleton */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div className="skeleton w-full h-72 md:h-full min-h-[360px]" />
          </div>

          {/* Info skeleton */}
          <div className="flex-1 p-8 space-y-5">
            {/* Genre tags */}
            <div className="flex gap-2">
              <div className="skeleton h-6 w-20 rounded-full" />
              <div className="skeleton h-6 w-24 rounded-full" />
              <div className="skeleton h-6 w-16 rounded-full" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <div className="skeleton h-10 w-3/4 rounded-lg" />
              <div className="skeleton h-6 w-1/2 rounded-lg" />
            </div>

            {/* Rating row */}
            <div className="flex gap-4">
              <div className="skeleton h-12 w-28 rounded-xl" />
              <div className="skeleton h-12 w-28 rounded-xl" />
              <div className="skeleton h-12 w-28 rounded-xl" />
            </div>

            {/* Plot */}
            <div className="space-y-2">
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-3/4 rounded" />
            </div>

            {/* Cast */}
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton h-8 w-24 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment skeleton */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score gauge skeleton */}
        <div className="rounded-2xl border border-cinema-border bg-cinema-card p-6 space-y-4">
          <div className="skeleton h-5 w-40 rounded" />
          <div className="flex items-center gap-6">
            <div className="skeleton w-28 h-28 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="skeleton h-7 w-24 rounded-lg" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-4/5 rounded" />
            </div>
          </div>
        </div>

        {/* Highlights skeleton */}
        <div className="rounded-2xl border border-cinema-border bg-cinema-card p-6 space-y-4">
          <div className="skeleton h-5 w-32 rounded" />
          <div className="space-y-2.5">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="skeleton w-5 h-5 rounded-full flex-shrink-0" />
                <div className="skeleton h-4 rounded flex-1" style={{ width: `${60 + i * 10}%` }} />
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-cinema-border space-y-2">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="skeleton w-5 h-5 rounded-full flex-shrink-0" />
                <div className="skeleton h-4 rounded" style={{ width: `${50 + i * 15}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading message */}
      <div className="flex items-center justify-center gap-3 mt-8 text-cinema-muted">
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-cinema-gold rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <span className="text-sm">Fetching movie data and generating AI insights...</span>
      </div>
    </div>
  );
}
