interface RecentSession {
	id: string;
	date: string;
	type: string;
	track: string;
	duration: number;
	players: number;
}

interface RecentSessionsProps {
	sessions: RecentSession[];
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
	const formatDuration = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	if (sessions.length === 0) {
		return (
			<div className="px-4 py-8 text-center text-sm text-gh-muted">No recent sessions found</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="min-w-full">
				<thead>
					<tr className="border-b border-gh-border-muted bg-gh-base">
						<th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gh-subtle">
							Date
						</th>
						<th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gh-subtle">
							Type
						</th>
						<th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gh-subtle">
							Track
						</th>
						<th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gh-subtle">
							Duration
						</th>
						<th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gh-subtle">
							Players
						</th>
					</tr>
				</thead>
				<tbody>
					{sessions.map((session) => (
						<tr key={session.id} className="border-b border-gh-border-muted transition-colors hover:bg-gh-hover last:border-0">
							<td className="px-4 py-3 text-sm text-gh-muted">
								{formatDate(session.date)}
							</td>
							<td className="px-4 py-3">
								<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
									session.type === 'R' ? 'bg-gh-green-bg text-gh-green' :
									session.type === 'Q' ? 'bg-gh-yellow-bg text-gh-yellow' :
									'bg-gh-blue-bg text-gh-blue'
								}`}>
									{session.type === 'R' ? 'Race' : session.type === 'Q' ? 'Qualify' : 'Practice'}
								</span>
							</td>
							<td className="px-4 py-3 text-sm text-gh-secondary">{session.track}</td>
							<td className="px-4 py-3 text-sm text-gh-muted">
								{formatDuration(session.duration)}
							</td>
							<td className="px-4 py-3 text-sm text-gh-secondary">
								{session.players}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
