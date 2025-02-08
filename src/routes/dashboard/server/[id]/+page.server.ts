import { updateConfig, getConfigFiles } from '$api/serverService';
import type { Actions } from './$types';
import { checkAuth } from '$api/authService';
import { getTracks } from '$api/lookupService';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const isAuth = await checkAuth();
	if (!isAuth) return redirect(308, '/login');
	const config = await getConfigFiles(params.id);
	const tracks = await getTracks();
	return {
		id: params.id,
		config,
		tracks
	};
};

export const actions = {
	event: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const object: any = {};
		formData.forEach((value, key) => {
			switch (key) {
				case 'id':
					return;
				case 'sessions':
					object[key] = tryParse(value as string);
					break;
				default:
					object[key] = !Number.isNaN(+value) ? +value : value;
			}
		});
		await updateConfig(id, 'event.json', object, true, true);
		redirect(303, '/dashboard');
	}
} satisfies Actions;

function tryParse(str: string) {
	try {
		return JSON.parse(str);
	} catch {
		return str;
	}
}
