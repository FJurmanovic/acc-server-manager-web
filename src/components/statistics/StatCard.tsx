interface StatCardProps {
	title: string;
	value: string | number;
	icon: string;
}

export function StatCard({ title, value, icon }: StatCardProps) {
	return (
		<div className="rounded-lg bg-gray-800 p-6">
			<div className="flex items-center">
				<div className="flex-shrink-0">
					<span className="text-3xl">{icon}</span>
				</div>
				<div className="ml-4">
					<div className="text-2xl font-semibold text-white">{value}</div>
					<div className="text-sm text-gray-400">{title}</div>
				</div>
			</div>
		</div>
	);
}
