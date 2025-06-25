import { fetchAPIEvent } from '$api/apiService';
import { env } from '$env/dynamic/private';
import { authStore } from '$stores/authStore';
import { redisSessionManager } from '$stores/redisSessionManager';
import type { RequestEvent } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

export const login = async (event: RequestEvent, username: string, password: string) => {
	try {
		const response = await fetch(`${env.API_BASE_URL}/auth/login`, {
			method: 'POST',
			body: JSON.stringify({ username, password }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			console.log(response);
			const errorData = await response
				.json()
				.catch(() => ({ error: 'Invalid username or password.' }));
			authStore.set({
				token: undefined,
				error: errorData.error || 'Invalid username or password.'
			});
			return false;
		}

		const { token } = await response.json();

		await redisSessionManager.createSession(event.cookies, { token }, uuidv4());

		return true;
	} catch (err) {
		authStore.set({ token: undefined, error: 'Login failed. Please try again.' });
		return false;
	}
};

export const logout = (event: RequestEvent) => {
	return redisSessionManager.deleteCookie(event.cookies);
};

export const checkAuth = async (event: RequestEvent) => {
	try {
		await fetchAPIEvent(event, '/api');
		return true;
	} catch (err) {
		return false;
	}
};
