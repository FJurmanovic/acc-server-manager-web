'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { Server, ServiceStatus, serviceStatusToString } from '@/lib/schemas';
import {
	startServerEventAction,
	restartServerEventAction,
	stopServerEventAction
} from '@/lib/actions/servers';
import { useRouter } from 'next/navigation';
import { StatusDot } from '@/components/ui/StatusDot';
import { Badge } from '@/components/ui/Badge';
import { GhButton } from '@/components/ui/GhButton';

interface ServerCardProps {
	server: Server;
}

function statusBadgeVariant(status: ServiceStatus): 'green' | 'yellow' | 'gray' {
	if (status === ServiceStatus.Running) return 'green';
	if (
		[ServiceStatus.Starting, ServiceStatus.Restarting, ServiceStatus.Stopping].includes(status)
	)
		return 'yellow';
	return 'gray';
}

export function ServerCard({ server }: ServerCardProps) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const startServer = () =>
		startTransition(async () => {
			await startServerEventAction(server.id);
			router.refresh();
		});
	const restartServer = () =>
		startTransition(async () => {
			await restartServerEventAction(server.id);
			router.refresh();
		});
	const stopServer = () =>
		startTransition(async () => {
			await stopServerEventAction(server.id);
			router.refresh();
		});

	const disabled = [
		ServiceStatus.Restarting,
		ServiceStatus.Starting,
		ServiceStatus.Stopping,
		ServiceStatus.Unknown,
	].includes(server.status);

	return (
		<div className="overflow-hidden rounded-lg border border-gh-border bg-gh-canvas transition-colors hover:border-gh-blue/40">
			<Link href={`/dashboard/server/${server.id}`} className="block p-4">
				<div className="flex items-start justify-between">
					<span className="text-sm font-semibold text-gh-primary">{server.name}</span>
					<StatusDot status={server.status} />
				</div>
				<div className="mt-1 text-xs text-gh-muted">
					{server.state?.track || 'No track'} · {server.state?.playerCount ?? 0} players
				</div>

				<div className="mt-3 grid grid-cols-2 gap-3">
					<div>
						<div className="text-xs text-gh-subtle">Players</div>
						<div className="text-sm font-semibold text-gh-primary">
							{server.state?.playerCount ?? 0}
						</div>
					</div>
					<div>
						<div className="text-xs text-gh-subtle">Track</div>
						<div className="truncate text-sm font-semibold text-gh-primary">
							{server.state?.track || 'N/A'}
						</div>
					</div>
				</div>

				<div className="mt-3">
					<Badge variant={statusBadgeVariant(server.status)}>
						{serviceStatusToString(server.status)}
					</Badge>
				</div>
			</Link>

			<div className="flex gap-1.5 border-t border-gh-border-muted bg-gh-base px-4 py-2">
				<GhButton
					variant="primary"
					size="sm"
					onClick={startServer}
					disabled={server.status === ServiceStatus.Running || isPending || disabled}
				>
					Start
				</GhButton>
				<GhButton
					variant="ghost"
					size="sm"
					onClick={restartServer}
					disabled={server.status === ServiceStatus.Stopped || isPending || disabled}
				>
					Restart
				</GhButton>
				<GhButton
					variant="danger-outline"
					size="sm"
					onClick={stopServer}
					disabled={server.status === ServiceStatus.Stopped || isPending || disabled}
				>
					Stop
				</GhButton>
			</div>
		</div>
	);
}
