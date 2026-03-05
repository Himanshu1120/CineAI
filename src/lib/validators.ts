import { ValidationResult } from '@/types/movie';

/**
 * Validates an IMDb movie ID format.
 * Valid format: "tt" followed by 7 or 8 digits (e.g., tt0133093)
 */
export function validateImdbId(id: string): ValidationResult {
  if (!id || id.trim() === '') {
    return { valid: false, error: 'Please enter an IMDb ID or movie name.' };
  }

  const trimmed = id.trim();

  // Check for IMDb ID format
  if (trimmed.startsWith('tt')) {
    const imdbPattern = /^tt\d{7,8}$/;
    if (!imdbPattern.test(trimmed)) {
      return {
        valid: false,
        error: 'Invalid IMDb ID format. Expected format: tt0133093 (tt + 7-8 digits).',
      };
    }
    return { valid: true };
  }

  // If not an ID, treat as a search query (min 2 chars)
  if (trimmed.length < 2) {
    return { valid: false, error: 'Search query must be at least 2 characters.' };
  }

  return { valid: true };
}

/**
 * Checks whether the input looks like an IMDb ID
 */
export function isImdbId(input: string): boolean {
  return /^tt\d{7,8}$/.test(input.trim());
}

/**
 * Sanitizes input to prevent injection
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>"']/g, '');
}
