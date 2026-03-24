import { fetchServerAPI } from './base';
import {
	type Configurations,
	type Config,
	ConfigFile,
	configurationsSchema,
	configSchemaMap
} from '@/lib/schemas/config';
import * as z from 'zod';

export type ConfigAuditRecord = {
	id: string;
	serverId: string;
	configFile: string;
	oldConfig: string;
	newConfig: string;
	changedAt: string;
};

const serverRoute = '/server';

export async function getServerConfigurations(
	token: string,
	serverId: string
): Promise<Configurations> {
	const response = await fetchServerAPI<Configurations>(`${serverRoute}/${serverId}/config`, token);
	return configurationsSchema.parse(response.data);
}

export function validateConfig(
	configType: ConfigFile,
	data: unknown
): z.infer<(typeof configSchemaMap)[typeof configType]> {
	const schema = configSchemaMap[configType];
	return schema.parse(data);
}

export async function getServerConfiguration(
	token: string,
	serverId: string,
	configType: ConfigFile
): Promise<Config> {
	const response = await fetchServerAPI<Config>(
		`${serverRoute}/${serverId}/config/${configType}`,
		token
	);
	return validateConfig(configType, response.data);
}

export async function updateServerConfiguration(
	token: string,
	serverId: string,
	configType: ConfigFile,
	config: Config,
	restart = false
): Promise<void> {
	await fetchServerAPI(
		`${serverRoute}/${serverId}/config/${configType}?override=true&restart=${restart}`,
		token,
		'PUT',
		{
			...validateConfig(configType, config)
		}
	);
}

export async function bulkUpdateServerConfigurations(
	token: string,
	serverId: string,
	configs: Partial<Configurations>,
	restart = false
): Promise<void> {
	await fetchServerAPI<ConfigAuditRecord[]>(
		`${serverRoute}/${serverId}/config?override=true&restart=${restart}`,
		token,
		'PATCH',
		configs
	);
}
