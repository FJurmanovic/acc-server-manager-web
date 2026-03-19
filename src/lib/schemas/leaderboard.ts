import * as z from 'zod';

export const resultValueSchema = z.union([z.literal('DNF'), z.literal('DNS'), z.coerce.number().int().min(0)]);
export type ResultValue = z.infer<typeof resultValueSchema>;

export const leaderboardDriverSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
	initials: z.string().min(1).max(10)
});
export type LeaderboardDriver = z.infer<typeof leaderboardDriverSchema>;

const pointsEntryFields = {
	id: z.string(),
	points: z.number().int().min(0),
	label: z.string().min(1),
	color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
	textColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
	priority: z.number().int().min(0)
};

export const pointsEntrySchema = z.object(pointsEntryFields);
export type PointsEntry = z.infer<typeof pointsEntrySchema>;

export const flPointsSchema = z.object({
	points: z.number().int().min(0),
	label: z.string().min(1),
	color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
	textColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
	priority: z.number().int().min(0)
});
export type FlPoints = z.infer<typeof flPointsSchema>;

export const leaderboardTrackSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	results: z.array(z.object({ driverId: z.string(), score: resultValueSchema })),
	fastestLapDriverId: z.string().nullable()
});
export type LeaderboardTrack = z.infer<typeof leaderboardTrackSchema>;

export const leaderboardSchema = z.object({
	id: z.string().optional(),
	serverId: z.string().optional(),
	drivers: z.array(leaderboardDriverSchema),
	pointsTable: z.array(pointsEntrySchema),
	flPoints: z.number().int().min(0),
	flColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
	flTextColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
	tracks: z.array(leaderboardTrackSchema)
});
export type Leaderboard = z.infer<typeof leaderboardSchema>;

export const emptyLeaderboard: Leaderboard = {
	drivers: [],
	pointsTable: [],
	flPoints: 1,
	flColor: '#8b5cf6',
	flTextColor: '#000000',
	tracks: []
};

// Client-side derived type — never sent to API
export type StandingsRow = {
	driver: LeaderboardDriver;
	driverId: string;
	totalPoints: number;
	trackResults: ResultValue[];
	fastestLapCount: number;
};
