import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes properly
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}