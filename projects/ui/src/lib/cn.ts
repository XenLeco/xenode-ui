import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Builds a class string from conditional inputs (clsx), then resolves
 * Tailwind conflicts so the LAST occurrence of a utility group wins
 * (tailwind-merge). Consumer classes are always passed last, which is what
 * makes a consumer's `class` override component defaults without
 * !important.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
