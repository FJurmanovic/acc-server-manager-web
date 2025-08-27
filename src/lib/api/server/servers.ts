import { fetchServerAPI } from './base';
import { Server } from '@/lib/types/server';

const serverRoute = '/server';

export async function getServers(token: string): Promise<Server[]> {
	const response = await fetchServerAPI<Server[]>(serverRoute, token);
	return response;
}

export async function getServer(token: string, serverId: string): Promise<Server> {
	const response = await fetchServerAPI<Server>(`${serverRoute}/${serverId}`, token);
	return response;
}

export async function restartService(token: string, serverId: string) {
	return fetchServerAPI(`${serverRoute}/${serverId}/service/restart`, token, 'POST');
}

export async function startService(token: string, serverId: string) {
	return fetchServerAPI(`${serverRoute}/${serverId}/service/start`, token, 'POST');
}

export async function stopService(token: string, serverId: string) {
	return fetchServerAPI(`${serverRoute}/${serverId}/service/stop`, token, 'POST');
}

export async function getServiceStatus(token: string, serverId: string) {
	return fetchServerAPI(`${serverRoute}/${serverId}/service`, token);
}
