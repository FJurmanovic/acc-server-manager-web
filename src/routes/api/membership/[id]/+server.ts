import { fetchAPIEvent } from '$api/apiService';
import { json, type RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
	try {
		const { params } = event;
		const userId = params.id;

		const user = await fetchAPIEvent(event, `/membership/${userId}`);
		return json(user);
	} catch (error) {
		console.error('Failed to fetch user:', error);
		return json({ error: 'Failed to fetch user' }, { status: 500 });
	}
}

export async function PUT(event: RequestEvent) {
	try {
		const { params } = event;
		const userId = params.id;
		const userData = await event.request.json();

		const user = await fetchAPIEvent(event, `/membership/${userId}`, 'PUT', userData);
		return json(user);
	} catch (error) {
		console.error('Failed to update user:', error);
		return json({ error: 'Failed to update user' }, { status: 500 });
	}
}

export async function DELETE(event: RequestEvent) {
	try {
		const { params } = event;
		const userId = params.id;

		await fetchAPIEvent(event, `/membership/${userId}`, 'DELETE');
		return json({ success: true });
	} catch (error) {
		console.error('Failed to delete user:', error);
		return json({ error: 'Failed to delete user' }, { status: 500 });
	}
}
