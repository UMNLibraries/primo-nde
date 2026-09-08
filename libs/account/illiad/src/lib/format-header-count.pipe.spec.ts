import { FormatHeaderCountPipe } from './format-header-count.pipe';

describe('FormatIllHeaderCountPipe', () => {
  const pipe = new FormatHeaderCountPipe();

  it('returns the array length enclosed in parentheses with a leading space', () => {
    const illTransactions = Array(5).fill({});
    expect(pipe.transform(illTransactions)).toBe(' (5)');
  });

  it('returns an empty string for an empty array', () => {
    expect(pipe.transform([])).toBe('');
  });
});
