import { logout } from '$api/authService';
import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const load = async (event: RequestEvent) => {
	await logout(event);
	redirect(303, '/login');
};
