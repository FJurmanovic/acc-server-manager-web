import { fetchServerAPI } from './base';
import { emptyLeaderboard, leaderboardSchema, type Leaderboard } from '@/lib/schemas/leaderboard';

export async function getLeaderboard(token: string, serverId: string): Promise<Leaderboard> {
	const response = await fetchServerAPI<Leaderboard>(`/server/${serverId}/leaderboard`, token);
	const parsed = leaderboardSchema.safeParse(response.data);
	return parsed.success ? parsed.data : emptyLeaderboard;
}
