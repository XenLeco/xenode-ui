import { cn } from './cn';

describe('cn', () => {
  it('joins classes and drops falsy values', () => {
    expect(cn('a', undefined, null, false, 'b')).toBe('a b');
  });

  it('supports conditional object syntax', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active');
  });

  it('resolves Tailwind conflicts in favor of the last class', () => {
    expect(cn('bg-primary', 'bg-red-500')).toBe('bg-red-500');
    expect(cn('px-4 py-2', 'p-8')).toBe('p-8');
  });

  it('keeps non-conflicting classes from both sides', () => {
    expect(cn('rounded-md text-sm', 'font-bold')).toBe('rounded-md text-sm font-bold');
  });
});
