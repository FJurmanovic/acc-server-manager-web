import { logout } from '$api/authService';
import { checkAuth } from '$api/authService';
import { getServers, restartService, startService, stopService } from '$api/serverService';
import { redirect, type Actions } from '@sveltejs/kit';

export const load = async (event) => {
	const isAuth = await checkAuth(event);
	if (!isAuth) return redirect(308, '/login');
	const servers = await getServers(event);
	return { servers };
};

export const actions = {
	start: async (event) => {
		const id = (await event.request.formData()).get('id') as string;
		await startService(event, +id);
	},
	restart: async (event) => {
		const id = (await event.request.formData()).get('id') as string;
		await restartService(event, +id);
	},
	stop: async (event) => {
		const id = (await event.request.formData()).get('id') as string;
		await stopService(event, +id);
	},
	logout: async (event) => {
		await logout(event);
		redirect(303, '/login');
	}
} satisfies Actions;
