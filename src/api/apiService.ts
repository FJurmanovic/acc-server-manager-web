import { authStore } from '$stores/authStore';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import { redisSessionManager } from '$stores/redisSessionManager';
import { env } from '$env/dynamic/private';

const BASE_URL = env.API_BASE_URL;

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
	event: RequestEvent,
	endpoint: string,
	method: string = 'GET',
	body?: object
) {
	const {
		data: { token }
	} = await redisSessionManager.getSession(event.cookies);

	return fetchAPI(endpoint, method, body, { Authorization: `Basic ${token}` });
}

export default fetchAPI;
