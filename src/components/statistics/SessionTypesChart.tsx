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
	'#3fb950', // green
	'#58a6ff', // blue
	'#f78166', // red
	'#d29922'  // yellow
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
					color: '#e6edf3',
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
