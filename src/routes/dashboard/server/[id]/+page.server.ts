import { updateConfig, getConfigFiles, getServerById } from '$api/serverService';
import type { Actions } from './$types';
import { checkAuth } from '$api/authService';
import { getTracks } from '$api/lookupService';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { configFile, type Config, type Session } from '$models/config';
import { set } from 'lodash-es';

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
	update: async (event: RequestEvent) => {
		const { id, restart, file, data } = await destructureFormData(event);

		const sessions: Array<Record<SessionField, string | number>> = [];

		await updateConfig(event, id, file, data, true, restart);
	}
} satisfies Actions;

async function destructureFormData(
	event: RequestEvent
): Promise<{ id: string; restart: string; data: Config; file: configFile }> {
	const formData = await event.request.formData();
	const id = formData.get('id') as string;
	const restart = formData.get('restart') as string;
	const file = formData.get('file') as configFile;
	const object: any = {};
	formData.forEach((value, key) => {
		switch (key) {
			case 'id':
			case 'restart':
			case 'file':
				return;
			default:
				set(object, key, parseFormField(value));
		}
	});
	return { id, restart, data: object, file };
}

function parseFormField(value: FormDataEntryValue): string | number {
	return value !== '' && !Number.isNaN(+value) ? +value : (value as string);
}

function tryParse(str: string) {
	try {
		return JSON.parse(str);
	} catch {
		return str;
	}
}
