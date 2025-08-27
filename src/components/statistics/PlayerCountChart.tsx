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
				borderColor: 'rgb(59, 130, 246)',
				backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
					color: '#e5e7eb'
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
					color: '#9ca3af'
				},
				grid: {
					color: '#374151'
				}
			},
			y: {
				beginAtZero: true,
				ticks: {
					color: '#9ca3af',
					stepSize: 1
				},
				grid: {
					color: '#374151'
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
