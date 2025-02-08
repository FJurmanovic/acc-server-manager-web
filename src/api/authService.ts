import fetchAPI, { fetchAPIEvent } from '$api/apiService';
import { authStore } from '$stores/authStore';
import type { RequestEvent } from '../routes/$types';

export const login = async (event: object, username: string, password: string) => {
	const token = btoa(`${username}:${password}`);
	event.cookies.set('token', token, { path: '/' });
	if (!(await checkAuth(event))) {
		{
			authStore.set({ token: undefined, error: 'Invalid username or password.' });
			return false;
		}
	}
	return true;
};

export const logout = (event) => {
	event.cookies.delete('token', { path: '/' });
};

export const checkAuth = async (event: object) => {
	try {
		await fetchAPIEvent(event, '/api');
		return true;
	} catch (err) {
		return false;
	}
};
