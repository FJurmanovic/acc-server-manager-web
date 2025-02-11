import fetchAPI, { fetchAPIEvent } from '$api/apiService';
import { authStore } from '$stores/authStore';
import { redisSessionManager } from '$stores/redisSessionManager';
import type { RequestEvent } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

export const login = async (event: RequestEvent, username: string, password: string) => {
	const token = btoa(`${username}:${password}`);
	await redisSessionManager.createSession(event.cookies, { token }, uuidv4());
	if (!(await checkAuth(event))) {
		{
			authStore.set({ token: undefined, error: 'Invalid username or password.' });
			return false;
		}
	}
	return true;
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
