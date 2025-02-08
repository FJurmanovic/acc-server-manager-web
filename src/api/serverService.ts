import fetchAPI from '$api/apiService';

export const getServers = async () => {
	return fetchAPI('/server');
};

export const getConfigFiles = async (serverId = '') => {
	return fetchAPI(`/server/${serverId}/config`);
};

export const getConfigFile = async (serverId = '', file = '') => {
	return fetchAPI(`/server/${serverId}/config/${file}`);
};

export const updateConfig = async (
	serverId: string,
	file: string,
	newConfig?: object,
	override = false,
	restart = true
) => {
	return fetchAPI(
		`/server/${serverId}/config/${file}?override=${override}&restart=${restart}`,
		'PUT',
		newConfig
	);
};

export const restartService = async (serverId: number) => {
	return fetchAPI('/api/restart', 'POST', { serverId });
};

export const startService = async (serverId: number) => {
	return fetchAPI('/api/start', 'POST', { serverId });
};

export const stopService = async (serverId: number) => {
	return fetchAPI('/api/stop', 'POST', { serverId });
};

export const getServiceStatus = async (serviceName: number) => {
	return fetchAPI(`/api/${serviceName}`);
};
