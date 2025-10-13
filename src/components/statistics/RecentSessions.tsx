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
			<div className="py-8 text-center">
				<div className="mb-2 text-4xl">📊</div>
				<p className="text-gray-400">No recent sessions found</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="min-w-full divide-y divide-gray-700">
				<thead>
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
							Date
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
							Type
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
							Track
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
							Duration
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
							Players
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-700">
					{sessions.map((session) => (
						<tr key={session.id} className="transition-colors hover:bg-gray-700">
							<td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
								{formatDate(session.date)}
							</td>
							<td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
								<span className="inline-flex items-center rounded-full bg-blue-900 px-2.5 py-0.5 text-xs font-medium text-blue-300">
									{session.type}
								</span>
							</td>
							<td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">{session.track}</td>
							<td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
								{formatDuration(session.duration)}
							</td>
							<td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
								{session.players}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
