import { authStore } from '$stores/authStore';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://acc.jurmanovic.com/v1';

async function fetchAPI(endpoint: string, method: string = 'GET', body?: object) {
	const { token } = get(authStore);
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Basic ${token}`
	};

	const response = await fetch(`${BASE_URL}${endpoint}`, {
		method,
		headers,
		body: body ? JSON.stringify(body) : null
	});

	console.log(`${BASE_URL}${endpoint}`, body, method, token);

	if (!response.ok) {
		if (endpoint != '/api' && response.status == 401) {
			authStore.set({
				username: undefined,
				password: undefined,
				token: undefined,
				error: 'Wrong authorization key!'
			});
			redirect(303, '/login');
		}
		throw new Error(`API Error: ${response.statusText}`);
	}

	if (response.headers.get('Content-Type') == 'application/json') return response.json();
	return response.text();
}

export default fetchAPI;
