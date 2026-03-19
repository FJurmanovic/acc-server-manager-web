import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function boolToInt(val: boolean) {
  return val ? 1 : 0;
}

export function intToBool(val: number) {
  return !!val
}
