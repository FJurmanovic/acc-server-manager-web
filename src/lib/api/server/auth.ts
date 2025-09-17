import { User } from '@/lib/types';
import { fetchServerAPI } from './base';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

const authRoute = '/auth';

export async function loginUser(username: string, password: string) {
	const response = await fetch(`${BASE_URL}${authRoute}/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ username, password })
	});

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error(`Invalid credentials`);
		}

		throw new Error(`Login failed: ${response.statusText}`);
	}

	const { token } = await response.json();

	const userResponse = await getCurrentUser(token);

	return { token, user: userResponse };
}

export async function getCurrentUser(token: string): Promise<User> {
	const response = await fetchServerAPI<User>(`${authRoute}/me`, token);
	return response.data!;
}

export async function getOpenToken(token: string): Promise<string> {
	const response = await fetchServerAPI<{ token: string }>(
		`${authRoute}/open-token`,
		token,
		'POST'
	);
	return response.data!.token;
}
