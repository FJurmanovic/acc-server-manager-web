'use client';

import type { StateHistoryStats } from '@/lib/schemas/statistics';
import { PlayerCountChart } from './PlayerCountChart';
import { SessionTypesChart } from './SessionTypesChart';
import { DailyActivityChart } from './DailyActivityChart';
import { StatCard } from './StatCard';
import { RecentSessions } from './RecentSessions';

interface StatisticsDashboardProps {
	stats: StateHistoryStats;
}

export function StatisticsDashboard({ stats }: StatisticsDashboardProps) {
	if (!stats) {
		return (
			<div className="py-12 text-center">
				<div className="mb-4 text-6xl">📊</div>
				<h3 className="mb-2 text-xl font-semibold text-white">No Statistics Available</h3>
				<p className="text-gray-400">No data found for the selected date range.</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<StatCard title="Total Sessions" value={stats.totalSessions ?? 0} icon="🏁" />
				<StatCard
					title="Total Playtime"
					value={`${Math.round(stats.totalPlaytime ?? 0 / 60)}h`}
					icon="⏱️"
				/>
				<StatCard
					title="Average Players"
					value={(stats.averagePlayers ?? 0).toFixed(1)}
					icon="👥"
				/>
				<StatCard title="Peak Players" value={stats.peakPlayers ?? 0} icon="🔥" />
			</div>

			{/* Charts */}
			<div className="grid grid-cols-12 gap-4">
				<div className="col-span-9 rounded-lg bg-gray-800 p-6">
					<h3 className="mb-4 text-lg font-medium text-white">Player Count Over Time</h3>
					<PlayerCountChart data={stats.playerCountOverTime ?? []} />
				</div>

				<div className="col-span-3 rounded-lg bg-gray-800 p-6">
					<h3 className="mb-4 text-lg font-medium text-white">Session Types</h3>
					<SessionTypesChart data={stats.sessionTypes ?? []} />
				</div>
			</div>

			<div className="rounded-lg bg-gray-800 p-6">
				<h3 className="mb-4 text-lg font-medium text-white">Daily Activity</h3>
				<DailyActivityChart data={stats.dailyActivity ?? []} />
			</div>

			{/* Recent Sessions */}
			<div className="rounded-lg bg-gray-800 p-6">
				<h3 className="mb-4 text-lg font-medium text-white">Recent Sessions</h3>
				<RecentSessions sessions={stats.recentSessions ?? []} />
			</div>
		</div>
	);
}
