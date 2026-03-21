'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Server, ServiceStatus } from '@/lib/schemas';
import {
	startServerEventAction,
	restartServerEventAction,
	stopServerEventAction
} from '@/lib/actions/servers';
import { StatusDot } from '@/components/ui/StatusDot';
import { GhButton } from '@/components/ui/GhButton';

interface ServerRowProps {
	server: Server;
}

export function ServerRow({ server }: ServerRowProps) {
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

	const transitioning = [
		ServiceStatus.Restarting,
		ServiceStatus.Starting,
		ServiceStatus.Stopping,
		ServiceStatus.Unknown,
	].includes(server.status);
	const disabled = transitioning || isPending;

	return (
		<div className="flex items-center justify-between gap-3 rounded-lg border border-gh-border bg-gh-canvas px-3 py-2.5 transition-colors hover:border-gh-border/60">
			<Link href={`/dashboard/server/${server.id}`} className="flex min-w-0 flex-1 items-center gap-3">
				<StatusDot status={server.status} />
				<div className="min-w-0">
					<div className="truncate text-sm font-semibold text-gh-primary">{server.name}</div>
					<div className="truncate text-xs text-gh-muted">
						{server.state?.track ?? 'No track'} · {server.state?.playerCount ?? 0} players
					</div>
				</div>
			</Link>
			<div className="flex shrink-0 gap-1.5">
				{server.status === ServiceStatus.Stopped ? (
					<GhButton variant="primary" size="sm" onClick={startServer} disabled={disabled}>
						Start
					</GhButton>
				) : (
					<>
						<GhButton
							variant="ghost"
							size="sm"
							onClick={restartServer}
							disabled={disabled}
						>
							Restart
						</GhButton>
						<GhButton
							variant="danger-outline"
							size="sm"
							onClick={stopServer}
							disabled={disabled}
						>
							Stop
						</GhButton>
					</>
				)}
			</div>
		</div>
	);
}
