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
import { Button } from '@/components/ui/Button';

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
	const isRunning = server.status === ServiceStatus.Running;

	return (
		<div className="overflow-hidden rounded-lg border border-border bg-canvas transition-colors hover:border-blue/40">
			<Link href={`/dashboard/server/${server.id}`} className="block p-4">
				<div className="flex items-start justify-between">
					<span className="text-sm font-semibold text-primary">{server.name}</span>
					<StatusDot status={server.status} />
				</div>

				<div className="mt-3 grid grid-cols-2 gap-3">
					<div>
						<div className="text-xs text-subtle">Players</div>
						<div className="text-sm font-semibold text-primary">
							{server.state?.playerCount ?? 0}
						</div>
					</div>
					<div>
						<div className="text-xs text-subtle">Track</div>
						<div className="truncate text-sm font-semibold text-primary">
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

			<div className="flex gap-1.5 border-t border-border-muted bg-base px-4 py-2">
				<Button
					variant="primary"
					size="sm"
					onClick={startServer}
					disabled={isRunning || disabled || isPending}
				>
					Start
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={restartServer}
					disabled={!isRunning || disabled || isPending}
				>
					Restart
				</Button>
				<Button
					variant="danger-outline"
					size="sm"
					onClick={stopServer}
					disabled={!isRunning || disabled || isPending}
				>
					Stop
				</Button>
			</div>
		</div>
	);
}
