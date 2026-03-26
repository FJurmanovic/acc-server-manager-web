import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FIELD_LABELS, SECTION_LABELS } from '@/lib/schemas/config';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function boolToInt(val: boolean) {
	return val ? 1 : 0;
}

export function intToBool(val: number) {
	return !!val;
}

export function formatZodIssues(issues: Array<{ path: PropertyKey[]; message: string }>): string {
	return issues
		.map((issue) => {
			const path = issue.path.map(String);
			const sectionKey = path.length > 1 ? path[0] : null;
			const fieldKey = path.at(-1) ?? '';
			const section = sectionKey && SECTION_LABELS[sectionKey] ? `[${SECTION_LABELS[sectionKey]}] ` : '';
			const label = FIELD_LABELS[fieldKey] ?? fieldKey;
			return `${section}${label}: ${issue.message}`;
		})
		.join('\n');
}
