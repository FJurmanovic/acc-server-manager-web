const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

type ApiResponse<T> = {
	data?: T;
	error?: string;
	message?: string;
};

import { logout } from '@/lib/auth/server';

const destroySession = async (): Promise<void> => {
	await logout();
};

export async function fetchServerAPI<T>(
	endpoint: string,
	token: string,
	method: string = 'GET',
	body?: object
): Promise<ApiResponse<T>> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`
	};

	const response = await fetch(`${BASE_URL}${endpoint}`, {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined,
		next: { tags: [endpoint] }
	});

	if (!response.ok) {
		if (response.status == 401) {
			await destroySession();
			return { error: 'unauthorized' };
		}
		throw new Error(
			`API Error: ${response.statusText} - ${method} - ${BASE_URL}${endpoint} - ${token}`
		);
	}

	if (response.headers.get('Content-Type')?.includes('application/json')) {
		return { data: await response.json() };
	}

	return { message: await response.text() };
}
