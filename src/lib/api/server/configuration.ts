import { fetchServerAPI } from './base';
import type { Configurations, ConfigFile, Config } from '@/lib/types/config';

const serverRoute = '/server';

export async function getServerConfigurations(
	token: string,
	serverId: string
): Promise<Configurations> {
	const response = await fetchServerAPI<Configurations>(`${serverRoute}/${serverId}/config`, token);
	return response.data!;
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
	return response.data!;
}

export async function updateServerConfiguration(
	token: string,
	serverId: string,
	configType: ConfigFile,
	config: Config,
	restart = false
): Promise<void> {
	await fetchServerAPI(`${serverRoute}/${serverId}/config/${configType}`, token, 'PUT', {
		...config,
		restart
	});
}
