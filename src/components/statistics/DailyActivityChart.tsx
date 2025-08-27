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
				backgroundColor: 'rgba(59, 130, 246, 0.8)',
				borderColor: 'rgb(59, 130, 246)',
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
					color: '#e5e7eb'
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
			<Bar data={chartData} options={options} />
		</div>
	);
}
