'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SessionCount {
	name: string;
	count: number;
}

interface SessionTypesChartProps {
	data: SessionCount[];
}

const colors = [
	'#3b82f6', // blue
	'#10b981', // emerald
	'#f59e0b', // amber
	'#ef4444', // red
	'#8b5cf6', // violet
	'#06b6d4' // cyan
];

export function SessionTypesChart({ data }: SessionTypesChartProps) {
	const chartData = {
		labels: data.map((item) => item.name),
		datasets: [
			{
				data: data.map((item) => item.count),
				backgroundColor: colors.slice(0, data.length),
				borderColor: colors.slice(0, data.length).map((color) => color + '20'),
				borderWidth: 2
			}
		]
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'bottom' as const,
				labels: {
					color: '#e5e7eb',
					padding: 20
				}
			},
			tooltip: {
				callbacks: {
					label: function (context: { label: string; parsed: number }) {
						const total = data.reduce((sum, item) => sum + item.count, 0);
						const percentage = ((context.parsed / total) * 100).toFixed(1);
						return `${context.label}: ${context.parsed} (${percentage}%)`;
					}
				}
			}
		}
	};

	return (
		<div className="h-64">
			<Doughnut data={chartData} options={options} />
		</div>
	);
}
