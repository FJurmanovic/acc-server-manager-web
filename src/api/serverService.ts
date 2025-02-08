import { fetchAPIEvent } from '$api/apiService';

export const getServers = async (event: object) => {
	return fetchAPIEvent(event, '/server');
};

export const getConfigFiles = async (event: object, serverId = '') => {
	return fetchAPIEvent(event, `/server/${serverId}/config`);
};

export const getConfigFile = async (event: object, serverId = '', file = '') => {
	return fetchAPIEvent(event, `/server/${serverId}/config/${file}`);
};

export const updateConfig = async (
	event: object,
	serverId: string,
	file: string,
	newConfig?: object,
	override = false,
	restart = true
) => {
	return fetchAPIEvent(
		event,
		`/server/${serverId}/config/${file}?override=${override}&restart=${restart}`,
		'PUT',
		newConfig
	);
};

export const restartService = async (event: object, serverId: number) => {
	return fetchAPIEvent(event, '/api/restart', 'POST', { serverId });
};

export const startService = async (event: object, serverId: number) => {
	return fetchAPIEvent(event, '/api/start', 'POST', { serverId });
};

export const stopService = async (event: object, serverId: number) => {
	return fetchAPIEvent(event, '/api/stop', 'POST', { serverId });
};

export const getServiceStatus = async (event: object, serviceName: number) => {
	return fetchAPIEvent(event, `/api/${serviceName}`);
};
