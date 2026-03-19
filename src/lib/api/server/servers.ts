import { fetchServerAPI } from './base';
import { Server, serverSchema, ServiceStatus, serviceStatusSchema } from '@/lib/schemas/server';

const serverRoute = '/server';

export async function getServers(token: string): Promise<Server[]> {
	const response = await fetchServerAPI<Server[]>(serverRoute, token);
	return serverSchema.array().parse(response.data);
}

export async function getServer(token: string, serverId: string): Promise<Server> {
	const response = await fetchServerAPI<Server>(`${serverRoute}/${serverId}`, token);
	return serverSchema.parse(response.data);
}

export async function restartService(token: string, serverId: string): Promise<void> {
	await fetchServerAPI(`${serverRoute}/${serverId}/service/restart`, token, 'POST');
}

export async function startService(token: string, serverId: string): Promise<void> {
	await fetchServerAPI(`${serverRoute}/${serverId}/service/start`, token, 'POST');
}

export async function stopService(token: string, serverId: string): Promise<void> {
	await fetchServerAPI(`${serverRoute}/${serverId}/service/stop`, token, 'POST');
}

export async function getServiceStatus(token: string, serverId: string): Promise<ServiceStatus> {
	const response = await fetchServerAPI<ServiceStatus>(`${serverRoute}/${serverId}/service`, token);
	return serviceStatusSchema.parse(response.data);
}

export async function createServer(token: string, name: string): Promise<Server> {
	const response = await fetchServerAPI<Server>(serverRoute, token, 'POST', { name });
	return serverSchema.parse(response.data);
}

export async function deleteServer(token: string, serverId: string): Promise<void> {
	await fetchServerAPI(`${serverRoute}/${serverId}`, token, 'DELETE');
}
