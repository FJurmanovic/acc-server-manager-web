import { checkAuth } from '$api/authService';
import { getServers, restartService, startService, stopService } from '$api/serverService';
import { redirect, type Actions } from '@sveltejs/kit';

export const load = async () => {
	const isAuth = await checkAuth();
	if (!isAuth) return redirect(308, '/login');
	const servers = await getServers();
	return { servers };
};

export const actions = {
	start: async ({ request }) => {
		const id = (await request.formData()).get('id') as string;
		await startService(+id);
	},
	restart: async ({ request }) => {
		const id = (await request.formData()).get('id') as string;
		console.log(id);
		await restartService(+id);
	},
	stop: async ({ request }) => {
		const id = (await request.formData()).get('id') as string;
		await stopService(+id);
	}
} satisfies Actions;
