'use client';

import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeScale
);

interface PlayerCountPoint {
	timestamp: string;
	count: number;
}

interface PlayerCountChartProps {
	data: PlayerCountPoint[];
}

export function PlayerCountChart({ data }: PlayerCountChartProps) {
	const chartData = {
		datasets: [
			{
				label: 'Player Count',
				data: data.map((point) => ({
					x: new Date(point.timestamp),
					y: point.count
				})),
				borderColor: '#58a6ff',
				backgroundColor: '#58a6ff1a',
				tension: 0.4
			}
		]
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top' as const,
				labels: {
					color: '#e6edf3'
				}
			}
		},
		scales: {
			x: {
				type: 'time' as const,
				time: {
					unit: 'hour' as const
				},
				ticks: {
					color: '#8b949e'
				},
				grid: {
					color: '#21262d'
				}
			},
			y: {
				beginAtZero: true,
				ticks: {
					color: '#8b949e',
					stepSize: 1
				},
				grid: {
					color: '#21262d'
				}
			}
		}
	};

	return (
		<div className="h-64">
			<Line data={chartData} options={options} />
		</div>
	);
}
