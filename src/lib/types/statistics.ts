export interface StateHistory {
	dateCreated: string;
	sessionStart: string;
	playerCount: number;
	track: string;
	sessionDurationMinutes: number;
	session: string;
}

interface SessionCount {
	name: string;
	count: number;
}

interface DailyActivity {
	date: string;
	sessionsCount: number;
}

interface PlayerCountPoint {
	timestamp: string;
	count: number;
}

interface RecentSession {
	id: number;
	date: string;
	type: string;
	track: string;
	duration: number;
	players: number;
}

export interface StateHistoryStats {
	averagePlayers: number;
	peakPlayers: number;
	totalSessions: number;
	totalPlaytime: number;
	playerCountOverTime: PlayerCountPoint[];
	sessionTypes: SessionCount[];
	dailyActivity: DailyActivity[];
	recentSessions: RecentSession[];
}
