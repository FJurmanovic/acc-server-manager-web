import { fetchAPIEvent } from '$api/apiService';
import { json, type RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
	try {
		const { url } = event;
		const queryParams = url.searchParams.toString();
		const endpoint = `/membership${queryParams ? `?${queryParams}` : ''}`;

		const users = await fetchAPIEvent(event, endpoint);
		return json(users);
	} catch (error) {
		console.error('Failed to fetch users:', error);
		return json({ error: 'Failed to fetch users' }, { status: 500 });
	}
}

export async function POST(event: RequestEvent) {
	try {
		const userData = await event.request.json();
		const user = await fetchAPIEvent(event, '/membership', 'POST', userData);
		return json(user);
	} catch (error) {
		console.error('Failed to create user:', error);
		return json({ error: 'Failed to create user' }, { status: 500 });
	}
}
