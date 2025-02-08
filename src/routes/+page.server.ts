import { checkAuth } from '$api/authService';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load = async (event) => {
	const isAuth = await checkAuth(event);
	if (isAuth) redirect(308, '/dashboard');
	redirect(308, '/login');
};

export const actions = {
	logout: async (event) => {
		event.cookies.delete('token', { path: '/' });
		redirect(303, '/login');
	}
} satisfies Actions;
