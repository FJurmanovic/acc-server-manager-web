import { authStore } from '$stores/authStore';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '../routes/$types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://acc-api.jurmanovic.com/v1';

async function fetchAPI(endpoint: string, method: string = 'GET', body?: object, hdr?: object) {
	const headers = {
		'Content-Type': 'application/json',
		...(hdr ?? {})
	};

	const response = await fetch(`${BASE_URL}${endpoint}`, {
		method,
		headers,
		body: body ? JSON.stringify(body) : null
	});

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

export async function fetchAPIEvent(
	event: object,
	endpoint: string,
	method: string = 'GET',
	body?: object
) {
	const token = event.cookies.get('token');

	return fetchAPI(endpoint, method, body, { Authorization: `Basic ${token}` });
}

export default fetchAPI;
