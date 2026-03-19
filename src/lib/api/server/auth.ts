import {
	Login,
	LoginResponse,
	loginResponseSchema,
	loginSchema,
	loginTokenSchema,
	User,
	userSchema
} from '@/lib/schemas';
import { fetchServerAPI } from './base';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

const authRoute = '/auth';

export async function loginUser(login: Login): Promise<LoginResponse> {
	const validatedLogin = loginSchema.parse(login);
	const response = await fetch(`${BASE_URL}${authRoute}/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(validatedLogin)
	});

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error(`Invalid credentials`);
		}

		throw new Error(`Login failed: ${response.statusText}`);
	}

	const rawData = await response.json();

	const { token } = loginTokenSchema.parse(rawData);

	const userResponse = await getCurrentUser(token);

	return loginResponseSchema.parse({ token, user: userResponse });
}

export async function getCurrentUser(token: string): Promise<User> {
	const response = await fetchServerAPI<User>(`${authRoute}/me`, token);
	return userSchema.parse(response.data);
}

export async function getOpenToken(token: string): Promise<string> {
	const response = await fetchServerAPI<{ token: string }>(
		`${authRoute}/open-token`,
		token,
		'POST'
	);
	return loginTokenSchema.parse(response.data).token;
}
