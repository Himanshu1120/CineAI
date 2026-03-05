'use client';

import { SentimentData } from '@/types/movie';

interface SentimentDetailsProps {
  sentiment: SentimentData;
}

export default function SentimentDetails({ sentiment }: SentimentDetailsProps) {
  return (
    <div className="rounded-2xl border border-cinema-border bg-cinema-card p-6
                    animate-fade-up stagger-4"
         style={{ animationFillMode: 'forwards' }}>

      <h3 className="text-cinema-muted text-xs font-medium uppercase tracking-widest mb-5">
        Audience Insights
      </h3>

      {/* Highlights */}
      {sentiment.highlights.length > 0 && (
        <div className="mb-4">
          <p className="text-cinema-muted text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            What people love
          </p>
          <ul className="space-y-2">
            {sentiment.highlights.map((highlight, i) => (
              <li key={i} className="flex items-start gap-2.5 group">
                <div className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20
                                flex items-center justify-center flex-shrink-0 mt-0.5
                                group-hover:bg-green-500/20 transition-colors">
                  <svg className="w-2.5 h-2.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-cinema-light text-sm leading-relaxed">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Criticisms */}
      {sentiment.criticisms.length > 0 && (
        <div className="pt-4 border-t border-cinema-border/50">
          <p className="text-cinema-muted text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            Common criticisms
          </p>
          <ul className="space-y-2">
            {sentiment.criticisms.map((criticism, i) => (
              <li key={i} className="flex items-start gap-2.5 group">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20
                                flex items-center justify-center flex-shrink-0 mt-0.5
                                group-hover:bg-amber-500/20 transition-colors">
                  <svg className="w-2.5 h-2.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                  </svg>
                </div>
                <span className="text-cinema-light text-sm leading-relaxed">{criticism}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
