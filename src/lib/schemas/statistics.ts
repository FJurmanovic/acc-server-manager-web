import * as z from 'zod';

export const stateHistorySchema = z.object({
	dateCreated: z.string(),
	sessionStart: z.string(),
	playerCount: z.number(),
	track: z.string(),
	sessionDurationMinutes: z.number(),
	session: z.string()
});
export type StateHistory = z.infer<typeof stateHistorySchema>;

export const sessionCountSchema = z.object({
	name: z.string(),
	count: z.number()
});
export type SessionCount = z.infer<typeof sessionCountSchema>;

export const dailyActivitySchema = z.object({
	date: z.string(),
	sessionsCount: z.number()
});
export type DailyActivity = z.infer<typeof dailyActivitySchema>;

export const playerCountPointSchema = z.object({
	timestamp: z.string(),
	count: z.number()
});
export type PlayerCountPoint = z.infer<typeof playerCountPointSchema>;

export const recentSessionSchema = z.object({
	id: z.number(),
	date: z.string(),
	type: z.string(),
	track: z.string(),
	duration: z.number(),
	players: z.number()
});
export type RecentSession = z.infer<typeof recentSessionSchema>;

export const stateHistoryStatsSchema = z.object({
	averagePlayers: z.number(),
	peakPlayers: z.number(),
	totalSessions: z.number(),
	totalPlaytime: z.number(),
	playerCountOverTime: z.array(playerCountPointSchema),
	sessionTypes: z.array(sessionCountSchema),
	dailyActivity: z.array(dailyActivitySchema),
	recentSessions: z.array(recentSessionSchema)
});
export type StateHistoryStats = z.infer<typeof stateHistoryStatsSchema>;

export const stateHistoryStatsFilterSchema = z.object({
	startDate: z.string().min(10, 'Start date is required'),
	endDate: z.string().min(10, 'End date is required')
});

export type StateHistoryStatsFilter = z.infer<typeof stateHistoryStatsFilterSchema>;
