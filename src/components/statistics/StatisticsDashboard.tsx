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
			<div className="py-16 text-center">
				<div className="mb-3 text-5xl">📊</div>
				<h3 className="mb-1 text-base font-semibold text-gh-primary">No Statistics Available</h3>
				<p className="text-sm text-gh-muted">No data found for the selected date range.</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{/* 4 stat cards */}
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard title="Total Sessions" value={stats.totalSessions ?? 0} icon="🏁" />
				<StatCard
					title="Total Playtime"
					value={`${Math.round((stats.totalPlaytime ?? 0) / 60)}h`}
					icon="⏱️"
				/>
				<StatCard
					title="Average Players"
					value={(stats.averagePlayers ?? 0).toFixed(1)}
					icon="👥"
				/>
				<StatCard title="Peak Players" value={stats.peakPlayers ?? 0} icon="🔥" />
			</div>

			{/* Charts row */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="lg:col-span-2 rounded-lg border border-gh-border bg-gh-canvas p-4">
					<h3 className="mb-3 text-sm font-semibold text-gh-primary">Player Count Over Time</h3>
					<PlayerCountChart data={stats.playerCountOverTime ?? []} />
				</div>
				<div className="rounded-lg border border-gh-border bg-gh-canvas p-4">
					<h3 className="mb-3 text-sm font-semibold text-gh-primary">Session Types</h3>
					<SessionTypesChart data={stats.sessionTypes ?? []} />
				</div>
			</div>

			<div className="rounded-lg border border-gh-border bg-gh-canvas p-4">
				<h3 className="mb-3 text-sm font-semibold text-gh-primary">Daily Activity</h3>
				<DailyActivityChart data={stats.dailyActivity ?? []} />
			</div>

			{/* Recent sessions */}
			<div className="overflow-hidden rounded-lg border border-gh-border bg-gh-canvas">
				<div className="border-b border-gh-border-muted px-4 py-3 text-sm font-semibold text-gh-primary">Recent Sessions</div>
				<RecentSessions sessions={stats.recentSessions ?? []} />
			</div>
		</div>
	);
}
