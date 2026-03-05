import { NextRequest, NextResponse } from 'next/server';
import { fetchMovieById } from '@/lib/omdb';
import { isImdbId, sanitizeInput, validateImdbId } from '@/lib/validators';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // Validate input presence
  if (!id) {
    return NextResponse.json(
      { error: 'Missing required parameter: id' },
      { status: 400 }
    );
  }

  const sanitized = sanitizeInput(id);

  // Must be a valid IMDb ID for this endpoint
  if (!isImdbId(sanitized)) {
    const validation = validateImdbId(sanitized);
    return NextResponse.json(
      { error: validation.error || 'Invalid IMDb ID format. Expected: tt0133093' },
      { status: 400 }
    );
  }

  try {
    const movie = await fetchMovieById(sanitized);
    return NextResponse.json(movie);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch movie details';

    // Differentiate between not-found and server errors
    const isNotFound = message.toLowerCase().includes('not found') ||
                       message.toLowerCase().includes('incorrect imdb');

    return NextResponse.json(
      { error: message },
      { status: isNotFound ? 404 : 500 }
    );
  }
}
