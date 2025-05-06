import { fetchAPIEvent } from '$api/apiService';
import {
	configFile,
	type AssistRules,
	type Config,
	type ConfigFile,
	type Configuration,
	type Configurations,
	type EventConfig,
	type EventRules,
	type ServerSettings
} from '$models/config';
import type { Server } from '$models/server';
import type { RequestEvent } from '@sveltejs/kit';

export const getServers = async (event: RequestEvent): Promise<Server[]> => {
	return fetchAPIEvent(event, '/server');
};

export const getServerById = async (event: RequestEvent, serverId: string): Promise<Server> => {
	return fetchAPIEvent(event, `/server/${serverId}`);
};

export const getConfigFiles = async (
	event: RequestEvent,
	serverId: string
): Promise<Configurations> => {
	return fetchAPIEvent(event, `/server/${serverId}/config`);
};

export const getConfigFile = async (
	event: RequestEvent,
	serverId: string,
	file: ConfigFile
): Promise<Config> => {
	return fetchAPIEvent(event, `/server/${serverId}/config/${file}`);
};

export const getEventFile = async (event: RequestEvent, serverId: string): Promise<EventConfig> => {
	return fetchAPIEvent(event, `/server/${serverId}/config/${configFile.event}`);
};

export const getConfigurationFile = async (
	event: RequestEvent,
	serverId: string
): Promise<Configuration> => {
	return fetchAPIEvent(event, `/server/${serverId}/config/${configFile.configuration}`);
};

export const getAssistRulesFile = async (
	event: RequestEvent,
	serverId: string
): Promise<AssistRules> => {
	return fetchAPIEvent(event, `/server/${serverId}/config/${configFile.assistRules}`);
};

export const getEventRulesFile = async (
	event: RequestEvent,
	serverId: string
): Promise<EventRules> => {
	return fetchAPIEvent(event, `/server/${serverId}/config/${configFile.eventRules}`);
};

export const getSettingsFile = async (
	event: RequestEvent,
	serverId: string
): Promise<ServerSettings> => {
	return fetchAPIEvent(event, `/server/${serverId}/config/${configFile.settings}`);
};

export const updateConfig = async (
	event: RequestEvent,
	serverId: string,
	file: ConfigFile,
	newConfig?: Config,
	override: boolean | string = false,
	restart: boolean | string = true
) => {
	return fetchAPIEvent(
		event,
		`/server/${serverId}/config/${file}?override=${override}&restart=${restart}`,
		'PUT',
		newConfig
	);
};

export const restartService = async (event: RequestEvent, serverId: number) => {
	return fetchAPIEvent(event, '/api/restart', 'POST', { serverId });
};

export const startService = async (event: RequestEvent, serverId: number) => {
	return fetchAPIEvent(event, '/api/start', 'POST', { serverId });
};

export const stopService = async (event: RequestEvent, serverId: number) => {
	return fetchAPIEvent(event, '/api/stop', 'POST', { serverId });
};

export const getServiceStatus = async (event: RequestEvent, serviceName: string) => {
	return fetchAPIEvent(event, `/api/${serviceName}`);
};
