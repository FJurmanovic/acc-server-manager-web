import { fetchServerAPI } from './base';
import {
	StateHistoryStatsFilter,
	stateHistoryStatsFilterSchema,
	stateHistoryStatsSchema,
	type StateHistoryStats
} from '@/lib/schemas/statistics';

const serverRoute = '/server';

export async function getServerStatistics(
	token: string,
	serverId: string,
	filters: StateHistoryStatsFilter
): Promise<StateHistoryStats> {
	const { startDate, endDate } = stateHistoryStatsFilterSchema.parse(filters);
	const response = await fetchServerAPI<StateHistoryStats>(
		`${serverRoute}/${serverId}/state-history/statistics?start_date=${startDate}&end_date=${endDate}`,
		token
	);
	return stateHistoryStatsSchema.parse(response.data);
}
