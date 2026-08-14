import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fungsi helper untuk menggabungkan class Tailwind CSS secara efisien
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}