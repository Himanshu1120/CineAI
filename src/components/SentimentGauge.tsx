'use client';

import { useEffect, useState } from 'react';
import { SentimentData } from '@/types/movie';

interface SentimentGaugeProps {
  sentiment: SentimentData;
}

const SENTIMENT_CONFIG = {
  positive: {
    color: '#22c55e',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    text: 'text-green-400',
    label: 'Positive',
    icon: '↑',
  },
  mixed: {
    color: '#f59e0b',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    label: 'Mixed',
    icon: '~',
  },
  negative: {
    color: '#ef4444',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    label: 'Negative',
    icon: '↓',
  },
};

export default function SentimentGauge({ sentiment }: SentimentGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const config = SENTIMENT_CONFIG[sentiment.sentiment];

  // Animate score on mount
  useEffect(() => {
    const duration = 1200;
    const steps = 60;
    const increment = sentiment.score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= sentiment.score) {
        setAnimatedScore(sentiment.score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [sentiment.score]);

  // SVG arc gauge calculation
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="rounded-2xl border border-cinema-border bg-cinema-card p-6
                    animate-fade-up stagger-3"
         style={{ animationFillMode: 'forwards' }}>

      <h3 className="text-cinema-muted text-xs font-medium uppercase tracking-widest mb-5">
        AI Sentiment Score
      </h3>

      <div className="flex items-center gap-6">
        {/* Circular gauge */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {/* Background track */}
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke="#1e1e30"
              strokeWidth="10"
            />
            {/* Animated fill */}
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke={config.color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
            />
          </svg>

          {/* Score number in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-3xl font-display tracking-wide"
              style={{ color: config.color }}
            >
              {animatedScore}
            </span>
            <span className="text-cinema-muted text-xs">/ 100</span>
          </div>
        </div>

        {/* Sentiment details */}
        <div className="flex-1 space-y-3">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
            ${config.bg} ${config.border} ${config.text} border`}>
            <span className="text-lg leading-none">{config.icon}</span>
            {config.label} Reception
          </div>

          {/* Summary */}
          <p className="text-cinema-light text-sm leading-relaxed">
            {sentiment.summary}
          </p>

          {/* Audience appeal */}
          <p className="text-cinema-muted text-xs italic">
            {sentiment.audienceAppeal}
          </p>
        </div>
      </div>
    </div>
  );
}
