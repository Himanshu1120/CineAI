import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CineAI — Movie Insight Builder',
  description: 'Enter any IMDb movie ID and get AI-powered audience sentiment analysis, cast details, and cinematic insights.',
  keywords: ['movie', 'IMDb', 'sentiment analysis', 'AI', 'film', 'reviews'],
  openGraph: {
    title: 'CineAI — Movie Insight Builder',
    description: 'AI-powered movie sentiment analysis and insights',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="noise min-h-screen bg-cinema-black">
        {children}
      </body>
    </html>
  );
}
