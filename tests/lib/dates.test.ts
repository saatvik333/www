import { describe, it, expect } from 'vitest';
import { formatDateShort, formatDateLong } from '@/lib/dates';

describe('formatDateShort', () => {
  it('formats as MM/DD/YYYY', () => {
    const result = formatDateShort('2025-03-15');
    // Expected format: "03/15/2025"
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it('handles different valid dates', () => {
    expect(formatDateShort('2024-01-01')).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    expect(formatDateShort('2026-12-31')).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });
});

describe('formatDateLong', () => {
  it('formats as Month D, YYYY', () => {
    const result = formatDateLong('2025-03-15');
    // Expected format: "March 15, 2025"
    expect(result).toMatch(/^[A-Z][a-z]+ \d+, \d{4}$/);
  });

  it('includes full month name', () => {
    const result = formatDateLong('2025-06-01');
    expect(result).toContain('June');
  });
});
