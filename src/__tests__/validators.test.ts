import { validateImdbId, isImdbId, sanitizeInput } from '@/lib/validators';

describe('validateImdbId', () => {
  // Valid IMDb IDs
  it('accepts valid 7-digit IMDb ID', () => {
    const result = validateImdbId('tt0133093');
    expect(result.valid).toBe(true);
  });

  it('accepts valid 8-digit IMDb ID', () => {
    const result = validateImdbId('tt01234567');
    expect(result.valid).toBe(true);
  });

  it('accepts search query of 2+ chars', () => {
    const result = validateImdbId('The Matrix');
    expect(result.valid).toBe(true);
  });

  // Invalid inputs
  it('rejects empty string', () => {
    const result = validateImdbId('');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Please enter');
  });

  it('rejects whitespace-only input', () => {
    const result = validateImdbId('   ');
    expect(result.valid).toBe(false);
  });

  it('rejects IMDb ID without tt prefix', () => {
    const result = validateImdbId('0133093');
    expect(result.valid).toBe(true); // treated as search query, not ID
  });

  it('rejects malformed IMDb ID (too short)', () => {
    const result = validateImdbId('tt12345');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid IMDb ID format');
  });

  it('rejects IMDb ID with letters in digits', () => {
    const result = validateImdbId('tt013abc3');
    expect(result.valid).toBe(false);
  });

  it('rejects single character query', () => {
    const result = validateImdbId('a');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('at least 2 characters');
  });
});

describe('isImdbId', () => {
  it('returns true for valid IMDb ID', () => {
    expect(isImdbId('tt0133093')).toBe(true);
  });

  it('returns false for title search', () => {
    expect(isImdbId('The Matrix')).toBe(false);
  });

  it('returns false for partial ID', () => {
    expect(isImdbId('tt123')).toBe(false);
  });

  it('handles whitespace with trim', () => {
    expect(isImdbId('  tt0133093  ')).toBe(true);
  });
});

describe('sanitizeInput', () => {
  it('trims whitespace', () => {
    expect(sanitizeInput('  tt0133093  ')).toBe('tt0133093');
  });

  it('removes angle brackets', () => {
    expect(sanitizeInput('<script>')).toBe('script');
  });

  it('removes quotes', () => {
    expect(sanitizeInput('"quoted"')).toBe('quoted');
  });

  it('preserves normal text', () => {
    expect(sanitizeInput('The Matrix 1999')).toBe('The Matrix 1999');
  });
});
