'use client';

import { Bar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DailyActivity {
	date: string;
	sessionsCount: number;
}

interface DailyActivityChartProps {
	data: DailyActivity[];
}

export function DailyActivityChart({ data }: DailyActivityChartProps) {
	const chartData = {
		labels: data.map((item) => new Date(item.date).toLocaleDateString()),
		datasets: [
			{
				label: 'Sessions',
				data: data.map((item) => item.sessionsCount),
				backgroundColor: '#3fb950',
				borderColor: '#3fb950',
				borderWidth: 1
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
			<Bar data={chartData} options={options} />
		</div>
	);
}
