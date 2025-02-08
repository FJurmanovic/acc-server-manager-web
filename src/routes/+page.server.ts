import { checkAuth } from '$api/authService';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	const isAuth = await checkAuth();
	if (isAuth) redirect(308, '/dashboard');
	redirect(308, '/login');
};
