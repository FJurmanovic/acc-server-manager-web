interface StatCardProps {
	title: string;
	value: string | number;
	icon: string;
}

export function StatCard({ title, value, icon }: StatCardProps) {
	return (
		<div className="rounded-lg border border-border bg-canvas p-4">
			<div className="mb-1 flex items-center gap-2">
				<span className="text-base">{icon}</span>
				<span className="text-xs text-muted">{title}</span>
			</div>
			<div className="text-2xl font-bold text-primary">{value}</div>
		</div>
	);
}
