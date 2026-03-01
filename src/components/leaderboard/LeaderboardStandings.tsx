'use client';

import { useMemo } from 'react';
import { Leaderboard, StandingsRow } from '@/lib/schemas/leaderboard';

interface LeaderboardStandingsProps {
	leaderboard: Leaderboard;
}

export function LeaderboardStandings({ leaderboard }: LeaderboardStandingsProps) {
	const standings = useMemo<StandingsRow[]>(() => {
		return leaderboard.drivers
			.map((driver) => {
				const trackResults = leaderboard.tracks.map(
					(t) => t.results.find((r) => r.driverId === driver.id)?.score ?? 'DNS'
				);
				const fastestLapCount = leaderboard.tracks.filter(
					(t) => t.fastestLapDriverId === driver.id
				).length;
				const totalPoints =
					trackResults.reduce((sum: number, r) => sum + (typeof r === 'number' ? r : 0), 0) +
					fastestLapCount * leaderboard.flPoints;
				return { driver, driverId: driver.id, totalPoints, trackResults, fastestLapCount };
			})
			.sort((a, b) => b.totalPoints - a.totalPoints);
	}, [leaderboard]);

	if (leaderboard.drivers.length === 0) {
		return (
			<div className="py-12 text-center">
				<div className="mb-2 text-4xl">🏆</div>
				<p className="text-gray-400">No drivers yet. Add drivers to see standings.</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full min-w-max text-sm">
				<thead>
					<tr className="border-b border-gray-700">
						<th className="py-2 pr-4 text-left text-xs font-semibold text-gray-400">Pos</th>
						<th className="py-2 pr-4 text-left text-xs font-semibold text-gray-400">Driver</th>
						{leaderboard.tracks.map((track, i) => (
							<th
								key={i}
								className="px-2 py-2 text-center text-xs font-semibold text-gray-400"
								title={track.name}
							>
								{track.name}
							</th>
						))}
						<th className="px-2 py-2 text-center text-xs font-semibold text-gray-400">FL</th>
						<th className="px-2 py-2 text-center text-xs font-semibold text-yellow-400">Pts</th>
					</tr>
				</thead>
				<tbody>
					{standings.map((row, pos) => (
						<tr key={row.driver.id} className="border-b border-gray-700/50">
							<td className="py-2 pr-4 text-gray-400">{pos + 1}</td>
							<td className="py-2 pr-4">
								<div className="flex items-center gap-2">
									<div
										className="h-3 w-3 shrink-0 rounded-full"
										style={{ backgroundColor: row.driver.color }}
									/>
									<span className="font-medium text-white">{row.driver.name}</span>
									<span className="text-xs text-gray-500">{row.driver.initials}</span>
								</div>
							</td>
							{row.trackResults.map((result, ti) => {
								const track = leaderboard.tracks[ti];
								const isFl = track.fastestLapDriverId === row.driver.id;
								return (
									<td key={ti} className="px-2 py-2 text-center">
										<span
											className={`inline-block rounded px-1.5 py-0.5 text-xs font-semibold ${
												typeof result === 'number'
													? 'text-white'
													: result === 'DNF'
														? 'text-orange-400'
														: 'text-gray-500'
											}`}
										>
											{result}
											{isFl && (
												<span
													className="ml-0.5 rounded px-0.5 text-xs"
													style={{
														backgroundColor: leaderboard.flColor,
														color: leaderboard.flTextColor
													}}
													title="Fastest lap"
												>
													FL
												</span>
											)}
										</span>
									</td>
								);
							})}
							<td className="px-2 py-2 text-center text-xs text-purple-400">
								{row.fastestLapCount > 0 ? `×${row.fastestLapCount}` : '—'}
							</td>
							<td className="px-2 py-2 text-center font-bold text-yellow-400">{row.totalPoints}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
