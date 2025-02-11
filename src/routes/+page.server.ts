import { checkAuth } from '$api/authService';
import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const load = async (event: RequestEvent) => {
	const isAuth = await checkAuth(event);
	if (isAuth) redirect(308, '/dashboard');
	redirect(308, '/login');
};
