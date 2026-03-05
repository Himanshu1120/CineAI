import { NextRequest, NextResponse } from 'next/server';
import { searchMoviesByTitle } from '@/lib/omdb';
import { sanitizeInput } from '@/lib/validators';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: 'Query must be at least 2 characters' },
      { status: 400 }
    );
  }

  const sanitized = sanitizeInput(query);

  try {
    const results = await searchMoviesByTitle(sanitized);

    if (results.Response === 'False') {
      return NextResponse.json({ Search: [], totalResults: '0', Response: 'False' });
    }

    return NextResponse.json(results);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Search failed';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
