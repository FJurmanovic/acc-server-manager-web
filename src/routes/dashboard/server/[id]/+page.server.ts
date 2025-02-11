import { updateConfig, getConfigFiles, getEventFile } from '$api/serverService';
import type { Actions } from './$types';
import { checkAuth } from '$api/authService';
import { getTracks } from '$api/lookupService';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { configFile } from '$models/config';

export const load = async (event: RequestEvent) => {
	const isAuth = await checkAuth(event);
	if (!isAuth) return redirect(308, '/login');
	if (!event.params.id) return redirect(308, '/dashboard');
	const config = await getEventFile(event, event.params.id);
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
		await updateConfig(event, id, configFile.event, object, true, true);
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
