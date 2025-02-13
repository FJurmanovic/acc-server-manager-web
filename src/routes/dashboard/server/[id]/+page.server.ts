import { updateConfig, getConfigFiles, getServerById } from '$api/serverService';
import type { Actions } from './$types';
import { checkAuth } from '$api/authService';
import { getTracks } from '$api/lookupService';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { configFile, type Session } from '$models/config';

export const load = async (event: RequestEvent) => {
	const isAuth = await checkAuth(event);
	if (!isAuth) return redirect(308, '/login');
	if (!event.params.id) return redirect(308, '/dashboard');
	const [server, configs, tracks] = await Promise.all([
		getServerById(event, event.params.id),
		getConfigFiles(event, event.params.id),
		getTracks(event)
	]);
	return {
		id: event.params.id,
		configs,
		tracks,
		server
	};
};

type SessionField =
	| 'sessionDurationMinutes'
	| 'sessionType'
	| 'timeMultiplier'
	| 'dayOfWeekend'
	| 'hourOfDay';

export const actions = {
	event: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const id = formData.get('id') as string;
		const restart = formData.get('restart') === 'true';
		const object: any = {};
		const sessions: Array<Record<SessionField, string | number>> = [];
		formData.forEach((value, key) => {
			const sessionMatch = key.match(/sessions\[(\d+)\]\[(\w+)\]/);
			if (sessionMatch) {
				const index = parseInt(sessionMatch[1]);
				const field = sessionMatch[2] as SessionField;

				if (!sessions[index]) {
					sessions[index] = {
						hourOfDay: 0,
						dayOfWeekend: 0,
						timeMultiplier: 0,
						sessionType: '',
						sessionDurationMinutes: 0
					};
				}

				// Assign the value to the corresponding session field
				sessions[index][field] = value !== '' && !Number.isNaN(+value) ? +value : (value as string);
			}
		});
		object.sessions = sessions;
		formData.forEach((value, key) => {
			switch (key) {
				case 'id':
				case 'restart':
				case 'sessions':
					return;
				default:
					object[key] = value != '' && !Number.isNaN(+value) ? +value : value;
			}
		});
		await updateConfig(event, id, configFile.event, object, true, restart);
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
