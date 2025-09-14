import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function clearAuthAndRedirect(to = '/login') {
	const c = await cookies();
	c.delete('session');
	c.delete('refresh');
	redirect(to);
}

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

type ApiResponse<T> = {
	data?: T;
	error?: string;
	message?: string;
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
		body: body ? JSON.stringify(body) : undefined
	});

	if (!response.ok) {
		if (response.status == 401) {
			clearAuthAndRedirect();
			return { error: 'unauthorized' };
		}
		throw new Error(
			`API Error: ${response.statusText} - ${method} - ${BASE_URL}${endpoint} - ${token}`
		);
	}

	if (response.headers.get('Content-Type')?.includes('application/json')) {
		return await response.json();
	}

	return { message: await response.text() };
}
