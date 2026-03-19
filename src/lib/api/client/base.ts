'use client';

import { SessionData } from '@/lib/session/config';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export type ClientApiResponse<T> = {
	data?: T;
	error?: string;
	message?: string;
};

const getSession = async (): Promise<SessionData | null> => {
	const response = await fetch('/api/session');
	if (response.ok) {
		return await response.json();
	}
	return null;
};

export async function fetchClientAPI<T>(
	endpoint: string,
	method: string = 'GET',
	body?: object,
	customToken?: string
): Promise<ClientApiResponse<T>> {
	let token = customToken;
	let session: SessionData | null = null;

	if (!token) {
		session = await getSession();
		token = session?.openToken;

		if (!token) {
			throw new Error('No authentication token available');
		}
	}

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
		if (response.status === 401) {
			window.location.href = '/login?expired=true';
			return { error: 'unauthorized' };
		}
		throw new Error(`API Error: ${response.statusText} - ${method} - ${BASE_URL}${endpoint}`);
	}

	if (response.headers.get('Content-Type')?.includes('application/json')) {
		return { data: await response.json() };
	}

	return { message: await response.text() };
}
