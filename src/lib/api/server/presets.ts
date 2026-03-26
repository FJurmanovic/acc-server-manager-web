import { fetchServerAPI } from './base';
import { configPresetSchema, type ConfigPreset } from '@/lib/schemas/preset';
import type { ConfigAuditRecord } from './configuration';

const route = '/presets';

export type ConfigPresetCreateRequest = {
	name: string;
	description?: string;
	configuration?: Record<string, unknown> | null;
	assistRules?: Record<string, unknown> | null;
	event?: Record<string, unknown> | null;
	eventRules?: Record<string, unknown> | null;
	settings?: Record<string, unknown> | null;
};

export async function createPreset(
	token: string,
	data: ConfigPresetCreateRequest
): Promise<ConfigPreset> {
	const response = await fetchServerAPI<ConfigPreset>(route, token, 'POST', data);
	return configPresetSchema.parse(response.data);
}

export async function listPresets(token: string, name?: string): Promise<ConfigPreset[]> {
	const query = name ? `?name=${encodeURIComponent(name)}` : '';
	const response = await fetchServerAPI<ConfigPreset[]>(`${route}${query}`, token);
	return configPresetSchema.array().parse(response.data);
}

export async function applyPreset(
	token: string,
	serverId: string,
	presetId: string,
	restart = false
): Promise<ConfigAuditRecord[]> {
	const response = await fetchServerAPI<ConfigAuditRecord[]>(
		`/server/${serverId}/config/presets/${presetId}/apply?restart=${restart}`,
		token,
		'POST'
	);
	return response.data ?? [];
}
