import {
	updateConfig,
	getConfigFiles,
	getServerById,
	getStateHistoryStats
} from '$api/serverService';
import type { Actions } from './$types';
import { checkAuth } from '$api/authService';
import { getTracks } from '$api/lookupService';
import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { configFile, type Config } from '$models/config';
import { set } from 'lodash-es';
import { subDays, formatISO } from 'date-fns';
import { UTCDate } from '@date-fns/utc';

export const load = async (event: RequestEvent) => {
	const isAuth = await checkAuth(event);
	if (!isAuth) return redirect(308, '/login');
	if (!event.params.id) return redirect(308, '/dashboard');
	const today = new UTCDate();
	const endDate = formatISO(today);
	const startDate = formatISO(subDays(today, 30));

	const [server, configs, tracks, statistics] = await Promise.all([
		getServerById(event, event.params.id),
		getConfigFiles(event, event.params.id),
		getTracks(event),
		getStateHistoryStats(event, event.params.id, startDate, endDate)
	]);
	return {
		id: event.params.id,
		configs,
		tracks,
		server,
		statistics
	};
};

export const actions = {
	update: async (event: RequestEvent) => {
		try {
			const { id, restart, file, data } = await destructureFormData(event);
			await updateConfig(event, id, file, data, true, restart);
			return { success: true, message: `Configuration file '${file}' updated successfully.` };
		} catch (err) {
			const message = err instanceof Error ? err.message : 'An unknown error occurred';
			return fail(500, { message: `Failed to update configuration: ${message}` });
		}
	}
} satisfies Actions;

async function destructureFormData(
	event: RequestEvent
): Promise<{ id: string; restart: boolean; data: Config; file: configFile }> {
	const formData = await event.request.formData();

	const id = formData.get('id');
	if (!id || typeof id !== 'string') {
		throw new Error('Server ID is missing or invalid.');
	}

	const file = formData.get('file');
	if (!file || typeof file !== 'string') {
		throw new Error('Config file name is missing or invalid.');
	}

	const restart = formData.get('restart');
	const object: Record<string, unknown> = {};

	formData.forEach((value, key) => {
		// Exclude metadata fields from the dynamic object
		if (key === 'id' || key === 'restart' || key === 'file') {
			return;
		}
		set(object, key, parseFormField(value));
	});

	return {
		id,
		restart: restart === 'on' || restart === 'true',
		data: object as unknown as Config,
		file: file as configFile
	};
}

/**
 * Parses a form field value. If the value can be cleanly converted to a number,
 * it returns a number; otherwise, it returns the original string.
 */
function parseFormField(value: FormDataEntryValue): string | number {
	// Avoid converting empty strings to 0
	if (value === '' || typeof value !== 'string') {
		return value as string;
	}
	// Check if string is a valid number without being too aggressive
	const num = Number(value);
	return !Number.isNaN(num) && value.trim() !== '' ? num : value;
}
