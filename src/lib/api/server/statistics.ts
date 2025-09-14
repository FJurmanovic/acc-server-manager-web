import { fetchServerAPI } from './base';
import type { StateHistoryStats } from '@/lib/types/statistics';

const serverRoute = '/server';

export async function getServerStatistics(
	token: string,
	serverId: string,
	startDate: string,
	endDate: string
): Promise<StateHistoryStats> {
	const response = await fetchServerAPI<StateHistoryStats>(
		`${serverRoute}/${serverId}/state-history/statistics?start_date=${startDate}&end_date=${endDate}`,
		token
	);
	return response.data!;
}
