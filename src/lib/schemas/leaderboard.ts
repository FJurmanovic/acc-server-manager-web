import * as z from 'zod';

export const resultValueSchema = z.union([z.number().int().min(0), z.literal('DNF'), z.literal('DNS')]);
export type ResultValue = z.infer<typeof resultValueSchema>;

export const leaderboardDriverSchema = z.object({
	name: z.string().min(1),
	color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
	initials: z.string().min(1).max(10)
});
export type LeaderboardDriver = z.infer<typeof leaderboardDriverSchema>;

const pointsEntryFields = {
	points: z.number().int().min(0),
	label: z.string().min(1),
	color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
	textColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
	priority: z.number().int().min(0)
};

export const pointsEntrySchema = z.object(pointsEntryFields);
export type PointsEntry = z.infer<typeof pointsEntrySchema>;

export const flPointsSchema = z.object(pointsEntryFields);
export type FlPoints = z.infer<typeof flPointsSchema>;

export const leaderboardTrackSchema = z.object({
	name: z.string().min(1),
	results: z.array(resultValueSchema),
	fastestLapInitials: z.string()
});
export type LeaderboardTrack = z.infer<typeof leaderboardTrackSchema>;

export const leaderboardSchema = z.object({
	drivers: z.array(leaderboardDriverSchema),
	pointsTable: z.array(pointsEntrySchema),
	flPoints: flPointsSchema,
	tracks: z.array(leaderboardTrackSchema)
});
export type Leaderboard = z.infer<typeof leaderboardSchema>;

export const emptyLeaderboard: Leaderboard = {
	drivers: [],
	pointsTable: [],
	flPoints: { points: 1, label: 'FL +1', color: '#8b5cf6', textColor: '#000000', priority: 3 },
	tracks: []
};

// Client-side derived type — never sent to API
export type StandingsRow = {
	driver: LeaderboardDriver;
	driverIndex: number;
	totalPoints: number;
	trackResults: ResultValue[];
	fastestLapCount: number;
};
