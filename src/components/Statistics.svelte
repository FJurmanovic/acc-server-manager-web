<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount, onDestroy } from 'svelte';
	import { compareAsc } from 'date-fns';
	import { formatInTimeZone } from 'date-fns-tz';
	import 'chartjs-adapter-date-fns';
	import type { StateHistory } from '$models/config';
	import { flatMap } from 'lodash-es';

	const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	interface Props {
		// Props
		stateHistory?: Array<StateHistory>;
	}

	let { stateHistory = [] }: Props = $props();

	// Chart instances
	let playerCountChart: Chart | null = null;
	let sessionTypeChart: Chart | null = null;
	let dailyActivityChart: Chart | null = null;

	// Chart canvas elements
	let playerCountCanvas: HTMLCanvasElement | undefined = $state();
	let sessionTypeCanvas: HTMLCanvasElement | undefined = $state();
	let dailyActivityCanvas: HTMLCanvasElement | undefined = $state();

	let totalSessions = $state(0);
	let averagePlayerCount = $state(0);
	let peakPlayerCount = $state(0);
	let totalPlaytime = $state(0);
	let dailyActivityData = $state<{
		labels: string[];
		data: {
			count: number;
			sessions: StateHistory[];
		}[];
	} | null>(null);

	// Initialize date range (last 30 days by default)
	onMount(() => {
		processData();
		createCharts();
	});

	onDestroy(() => {
		// Cleanup charts
		if (playerCountChart) playerCountChart.destroy();
		if (sessionTypeChart) sessionTypeChart.destroy();
		if (dailyActivityChart) dailyActivityChart.destroy();
	});

	function processData() {
		calculateSummaryStats();
	}

	function calculateSummaryStats() {
		totalSessions = stateHistory.length;

		if (stateHistory.length > 0) {
			const playerCounts = stateHistory.map((item) => item.playerCount);
			averagePlayerCount = Math.round(
				playerCounts.reduce((a, b) => a + b, 0) / playerCounts.length
			);
			peakPlayerCount = Math.max(...playerCounts);
			totalPlaytime = stateHistory.reduce(
				(total, session) => total + session.sessionDurationMinutes,
				0
			);
		} else {
			averagePlayerCount = 0;
			peakPlayerCount = 0;
			totalPlaytime = 0;
		}
	}

	function createCharts() {
		if (!playerCountCanvas || !sessionTypeCanvas || !dailyActivityCanvas) return;

		// Player Count Over Time Chart
		const playerCountData = preparePlayerCountData();
		playerCountChart = new Chart(playerCountCanvas, {
			type: 'line',
			data: {
				labels: playerCountData.map(({ x }) => x),
				datasets: [
					{
						label: 'Player Count',
						data: playerCountData.map(({ y }) => y),
						borderColor: '#10b981',
						backgroundColor: 'rgba(16, 185, 129, 0.1)',
						fill: true,
						tension: 0.4
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						labels: {
							color: '#ffffff'
						}
					}
				}
			}
		});

		// Session Types Pie Chart
		const sessionTypeData = prepareSessionTypeData();
		sessionTypeChart = new Chart(sessionTypeCanvas, {
			type: 'doughnut',
			data: {
				labels: sessionTypeData.labels,
				datasets: [
					{
						data: sessionTypeData.data,
						backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'bottom',
						labels: {
							color: '#ffffff',
							padding: 20
						}
					}
				}
			}
		});

		// Daily Activity Bar Chart
		dailyActivityData = prepareDailyActivityData();
		dailyActivityChart = new Chart(dailyActivityCanvas, {
			type: 'bar',
			data: {
				labels: dailyActivityData.labels,
				datasets: [
					{
						label: 'Sessions',
						data: dailyActivityData.data.map(({ count }) => count),
						backgroundColor: '#10b981',
						borderColor: '#059669',
						borderWidth: 1
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						labels: {
							color: '#ffffff'
						}
					}
				},
				scales: {
					x: {
						ticks: {
							color: '#9ca3af'
						},
						grid: {
							color: '#374151'
						}
					},
					y: {
						beginAtZero: true,
						ticks: {
							color: '#9ca3af'
						},
						grid: {
							color: '#374151'
						}
					}
				}
			}
		});
	}

	function preparePlayerCountData() {
		// Group by date and get average player count per day
		const dailyData = stateHistory.reduce(
			(acc, item) => {
				const date = formatDate(item.dateCreated, 'MMM dd kk:mm');
				if (!acc[date]) {
					acc[date] = { total: 0, count: 0 };
				}
				acc[date].total = acc[date].total > item.playerCount ? acc[date].total : item.playerCount;
				return acc;
			},
			{} as Record<string, { total: number; count: number }>
		);

		return Object.entries(dailyData)
			.map(([date, data]) => ({
				x: date,
				y: data.total
			}))
			.sort((a, b) => compareAsc(a.x, b.x));
	}

	function prepareSessionTypeData() {
		const sessionCounts = stateHistory.reduce(
			(acc, session) => {
				acc[session.session] = (acc[session.session] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		return {
			labels: Object.keys(sessionCounts),
			data: Object.values(sessionCounts)
		};
	}

	function prepareDailyActivityData() {
		const dailyActivity = stateHistory.reduce(
			(acc, session, index) => {
				const date = formatDate(session.dateCreated, 'yyyy-MM-dd');

				// Initialize counter for this date if not exists
				if (!acc[date]) {
					acc[date] = {
						count: 0,
						sessions: [session]
					};
				}

				// Check if this session is part of a sequence
				if (index > 0) {
					const prevSession = stateHistory[index - 1];
					const prevDate = formatDate(prevSession.dateCreated, 'yyyy-MM-dd');

					if (date === prevDate && prevSession.session === session.session) {
						return acc;
					}
				}

				// Increment counter for non-sequential sessions
				acc[date].count++;
				acc[date].sessions.push(session);
				return acc;
			},
			{} as Record<
				string,
				{
					count: number;
					sessions: StateHistory[];
				}
			>
		);

		const sortedEntries = Object.entries(dailyActivity).sort(
			([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
		);

		return {
			labels: sortedEntries.map(([date]) => formatDate(date, 'MMM dd')),
			data: sortedEntries.map(([, count]) => count)
		};
	}

	function formatDate(dateString: string, formatString: string) {
		return formatInTimeZone(dateString, localTimeZone, formatString, {
			timeZone: 'utc'
		});
	}

	function formatDuration(minutes: number) {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
	}
</script>

<!-- Summary Cards -->
<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
	<div class="rounded-lg bg-gray-800 p-6">
		<div class="flex items-center">
			<div class="rounded-lg bg-green-600 p-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
					/>
				</svg>
			</div>
			<div class="ml-4">
				<p class="text-sm font-medium text-gray-400">Average Players</p>
				<p class="text-2xl font-bold text-white">{averagePlayerCount}</p>
			</div>
		</div>
	</div>

	<div class="rounded-lg bg-gray-800 p-6">
		<div class="flex items-center">
			<div class="rounded-lg bg-yellow-600 p-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
					/>
				</svg>
			</div>
			<div class="ml-4">
				<p class="text-sm font-medium text-gray-400">Peak Players</p>
				<p class="text-2xl font-bold text-white">{peakPlayerCount}</p>
			</div>
		</div>
	</div>

	<div class="rounded-lg bg-gray-800 p-6">
		<div class="flex items-center">
			<div class="rounded-lg bg-blue-600 p-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
					/>
				</svg>
			</div>
			<div class="ml-4">
				<p class="text-sm font-medium text-gray-400">Total Sessions</p>
				<p class="text-2xl font-bold text-white">{totalSessions}</p>
			</div>
		</div>
	</div>

	<div class="rounded-lg bg-gray-800 p-6">
		<div class="flex items-center">
			<div class="rounded-lg bg-purple-600 p-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
			<div class="ml-4">
				<p class="text-sm font-medium text-gray-400">Total Playtime</p>
				<p class="text-2xl font-bold text-white">{formatDuration(totalPlaytime)}</p>
			</div>
		</div>
	</div>
</div>

<!-- Charts -->
<div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
	<!-- Player Count Over Time -->
	<div class="rounded-lg bg-gray-800 p-6">
		<h3 class="mb-4 text-lg font-semibold">Player Count Over Time</h3>
		<div class="h-64">
			<canvas bind:this={playerCountCanvas}></canvas>
		</div>
	</div>

	<!-- Session Types Pie Chart -->
	<div class="rounded-lg bg-gray-800 p-6">
		<h3 class="mb-4 text-lg font-semibold">Session Types</h3>
		<div class="h-64">
			<canvas bind:this={sessionTypeCanvas}></canvas>
		</div>
	</div>
</div>

<!-- Daily Activity Bar Chart -->
<div class="mb-8 rounded-lg bg-gray-800 p-6">
	<h3 class="mb-4 text-lg font-semibold">Daily Activity</h3>
	<div class="h-64">
		<canvas bind:this={dailyActivityCanvas}></canvas>
	</div>
</div>

<!-- Session History Table -->
<div class="rounded-lg bg-gray-800 p-6">
	<h3 class="mb-4 text-lg font-semibold">Recent Sessions</h3>
	<div class="overflow-x-auto">
		<table class="min-w-full divide-y divide-gray-700">
			<thead class="bg-gray-700">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase"
						>Date</th
					>
					<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase"
						>Type</th
					>
					<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase"
						>Track</th
					>
					<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase"
						>Duration</th
					>
					<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase"
						>Players</th
					>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-700 bg-gray-800">
				{#each flatMap(dailyActivityData?.data, ({ sessions }) => sessions) as session}
					<tr>
						<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
							{formatDate(session.dateCreated, 'MMM dd kk:mm')}
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<span
								class={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
									session.session === 'Race'
										? 'bg-red-100 text-red-800'
										: session.session === 'Qualifying'
											? 'bg-yellow-100 text-yellow-800'
											: 'bg-green-100 text-green-800'
								}`}
							>
								{session.session}
							</span>
						</td>
						<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
							{session.track}
						</td>
						<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
							{formatDuration(session.sessionDurationMinutes)}
						</td>
						<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
							{session.playerCount}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
