import { describe, it, expect } from 'vitest';
import { formatDateShort, formatDateLong } from '@/lib/dates';

describe('formatDateShort', () => {
  it('formats as MM/DD/YYYY', () => {
    const result = formatDateShort('2025-03-15');
    // Expected format: "03/15/2025"
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it('formats deterministically in UTC regardless of runtime timezone', () => {
    expect(formatDateShort('2025-03-15')).toBe('03/15/2025');
    expect(formatDateShort('2024-01-01')).toBe('01/01/2024');
    expect(formatDateShort('2026-12-31')).toBe('12/31/2026');
  });
});

describe('formatDateLong', () => {
  it('formats as Month D, YYYY', () => {
    const result = formatDateLong('2025-03-15');
    // Expected format: "March 15, 2025"
    expect(result).toMatch(/^[A-Z][a-z]+ \d+, \d{4}$/);
  });

  it('formats deterministically in UTC regardless of runtime timezone', () => {
    expect(formatDateLong('2025-03-15')).toBe('March 15, 2025');
    expect(formatDateLong('2025-06-01')).toBe('June 1, 2025');
  });
});
