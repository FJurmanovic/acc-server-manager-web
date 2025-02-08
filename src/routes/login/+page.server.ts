import { checkAuth, login } from '$api/authService';
import { authStore } from '$stores/authStore';
import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ request }) => {
		const formData = await request.formData();
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;
		if (!username || !password) {
			authStore.set({ error: 'Invalid username or password' });
			return;
		}
		const isAuth = await login(username, password);
		if (isAuth) redirect(303, '/dashboard');
	}
} satisfies Actions;
