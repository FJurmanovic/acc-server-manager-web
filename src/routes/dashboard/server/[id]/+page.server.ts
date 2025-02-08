import { updateConfig, getConfigFiles } from '$api/serverService';
import type { Actions, RequestEvent } from './$types';
import { checkAuth } from '$api/authService';
import { getTracks } from '$api/lookupService';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const isAuth = await checkAuth(event);
	if (!isAuth) return redirect(308, '/login');
	const config = await getConfigFiles(event, event.params.id);
	const tracks = await getTracks(event);
	return {
		id: event.params.id,
		config,
		tracks
	};
};

export const actions = {
	event: async (event: RequestEvent) => {
		const formData = await event.request.formData();
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
					object[key] = value != '' && !Number.isNaN(+value) ? +value : value;
			}
		});
		await updateConfig(event, id, 'event.json', object, true, true);
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
