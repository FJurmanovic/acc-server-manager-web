import { fetchServerAPI } from './base';
import {
	type Configurations,
	type Config,
	ConfigFile,
	configurationsSchema,
	configSchemaMap
} from '@/lib/schemas/config';
import * as z from 'zod';

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
	await fetchServerAPI(`${serverRoute}/${serverId}/config/${configType}?override=true`, token, 'PUT', {
		...validateConfig(configType, config),
		restart
	});
}
