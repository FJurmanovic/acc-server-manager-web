import { fetchServerAPI } from './base';
import type {
	Configurations,
	Configuration,
	AssistRules,
	EventConfig,
	EventRules,
	ServerSettings,
	ConfigFile
} from '@/lib/types/config';

const serverRoute = '/server';

export async function getServerConfigurations(
	token: string,
	serverId: string
): Promise<Configurations> {
	return fetchServerAPI<Configurations>(`${serverRoute}/${serverId}/config`, token);
}

export async function getServerConfiguration(
	token: string,
	serverId: string,
	configType: ConfigFile
): Promise<Configuration | AssistRules | EventConfig | EventRules | ServerSettings> {
	return fetchServerAPI(`${serverRoute}/${serverId}/config/${configType}`, token);
}

export async function updateServerConfiguration(
	token: string,
	serverId: string,
	configType: ConfigFile,
	config: Configuration | AssistRules | EventConfig | EventRules | ServerSettings,
	restart = false
): Promise<void> {
	await fetchServerAPI(`${serverRoute}/${serverId}/config/${configType}`, token, 'PUT', {
		...config,
		restart
	});
}
