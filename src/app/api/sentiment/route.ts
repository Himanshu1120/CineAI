import { NextRequest, NextResponse } from 'next/server';
import { analyzeMovieSentiment } from '@/lib/gemini';
import { MovieData } from '@/types/movie';

export async function POST(request: NextRequest) {
  let body: { movie?: MovieData };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }

  const { movie } = body;

  if (!movie || !movie.imdbID || !movie.Title) {
    return NextResponse.json(
      { error: 'Missing required field: movie data' },
      { status: 400 }
    );
  }

  try {
    const sentiment = await analyzeMovieSentiment(movie);
    return NextResponse.json(sentiment);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to analyze sentiment';

    // Return 429 with specific message so the frontend can show the right error UI
    if (message.startsWith('QUOTA_EXCEEDED:')) {
      return NextResponse.json(
        { error: message.replace('QUOTA_EXCEEDED: ', '') },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

