import { render, screen } from '@testing-library/react';
import ErrorDisplay from '@/components/ErrorDisplay';
import LoadingSkeleton from '@/components/LoadingSkeleton';

describe('ErrorDisplay', () => {
  it('renders error message in the document', () => {
    render(<ErrorDisplay error="Movie not found" />);
    const elements = screen.getAllByText('Movie not found');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('shows "Movie not found" heading for not-found errors', () => {
    render(<ErrorDisplay error="Movie not found. Please check the IMDb ID." />);
    const heading = screen.getByRole('heading', { name: /movie not found/i });
    expect(heading).toBeTruthy();
  });

  it('shows retry button when onRetry is provided for generic errors', () => {
    const mockRetry = jest.fn();
    render(<ErrorDisplay error="Some generic error" onRetry={mockRetry} />);
    const retryBtn = screen.getByText('Try again');
    expect(retryBtn).toBeTruthy();
  });

  it('does not show retry button when onRetry is not provided', () => {
    render(<ErrorDisplay error="Some error" />);
    const retryBtn = screen.queryByText('Try again');
    expect(retryBtn).toBeNull();
  });

  it('shows API configuration title for API key errors', () => {
    render(<ErrorDisplay error="GEMINI_API_KEY is not configured" />);
    const heading = screen.getByRole('heading', { name: /api not configured/i });
    expect(heading).toBeTruthy();
  });

  it('does NOT show retry button for API key errors', () => {
    const mockRetry = jest.fn();
    render(<ErrorDisplay error="GEMINI_API_KEY is not configured" onRetry={mockRetry} />);
    expect(screen.queryByText('Try again')).toBeNull();
  });

  it('shows daily limit title for quota exceeded errors', () => {
    render(<ErrorDisplay error="Daily AI analysis limit reached (20 req/day on free tier)." />);
    const heading = screen.getByRole('heading', { name: /daily ai limit reached/i });
    expect(heading).toBeTruthy();
  });

  it('shows daily limit title for 429 quota errors', () => {
    render(<ErrorDisplay error="quota exceeded for gemini-2.5-flash" />);
    const heading = screen.getByRole('heading', { name: /daily ai limit reached/i });
    expect(heading).toBeTruthy();
  });

  it('does NOT show retry button for quota exceeded errors', () => {
    const mockRetry = jest.fn();
    render(<ErrorDisplay error="Daily AI analysis limit reached" onRetry={mockRetry} />);
    expect(screen.queryByText('Try again')).toBeNull();
  });

  it('shows connection error title for network errors', () => {
    render(<ErrorDisplay error="fetch failed: network error" />);
    const heading = screen.getByRole('heading', { name: /connection error/i });
    expect(heading).toBeTruthy();
  });
});

describe('LoadingSkeleton', () => {
  it('renders without crashing', () => {
    render(<LoadingSkeleton />);
    const loadingText = screen.getByText(/Fetching movie data/i);
    expect(loadingText).toBeTruthy();
  });

  it('renders skeleton elements', () => {
    const { container } = render(<LoadingSkeleton />);
    const skeletons = container.querySelectorAll('.skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
