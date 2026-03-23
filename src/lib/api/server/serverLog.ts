import { fetchServerAPI } from './base';

export async function getServerLog(
	token: string,
	serverId: string,
	lines: number = 100
): Promise<string[]> {
	const response = await fetchServerAPI<{ lines: string[] }>(
		`/server/${serverId}/log?lines=${lines}`,
		token
	);
	return response.data?.lines ?? [];
}
