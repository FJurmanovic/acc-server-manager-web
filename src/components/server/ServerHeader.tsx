'use client';
import Link from 'next/link';
import { Server, serviceStatusToString, ServiceStatus } from '@/lib/schemas/server';
import { getTrackDisplayName } from '@/lib/constants/tracks';
import {
	startServerEventAction,
	restartServerEventAction,
	stopServerEventAction
} from '@/lib/actions/servers';
import { hasPermission, User } from '@/lib/schemas';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DeleteServerModal } from './DeleteServerModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ServerHeaderProps {
	server: Server;
	user: User;
}

export function ServerHeader({ server, user }: ServerHeaderProps) {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const canDeleteServer = hasPermission(user, 'server.delete');
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
		ServiceStatus.Unknown
	].includes(server.status);

	return (
		<>
			<header className="flex flex-col gap-2 border-b border-border-muted px-5 py-2 sm:h-12 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:py-0">
				<div className="flex items-center gap-2 text-sm">
					<Link href="/dashboard" className="text-blue hover:underline">Servers</Link>
					<span className="text-subtle">/</span>
					<span className="font-semibold text-primary">{server.name}</span>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant={
						server.status === ServiceStatus.Running ? 'green' :
						server.status === ServiceStatus.Stopped ? 'gray' : 'yellow'
					}>
						● <span className="hidden sm:inline">{serviceStatusToString(server.status)}</span>
					</Badge>
					<Button variant="ghost" size="sm" onClick={startServer} disabled={server.status === ServiceStatus.Running || disabled || isPending}>Start</Button>
					<Button variant="ghost" size="sm" onClick={restartServer} disabled={server.status === ServiceStatus.Stopped || disabled || isPending}>Restart</Button>
					<Button variant="danger-outline" size="sm" onClick={stopServer} disabled={server.status === ServiceStatus.Stopped || disabled || isPending}>Stop</Button>
					{canDeleteServer && (
						<Button variant="danger-solid" size="sm" onClick={() => setIsDeleteModalOpen(true)} disabled={disabled || isPending}>Remove</Button>
					)}
				</div>
			</header>

			<div className="flex flex-wrap gap-6 border-b border-border-muted px-5 py-3">
				{[
					{ label: 'Track', value: server.state?.track ? getTrackDisplayName(server.state.track) : 'N/A' },
					{ label: 'Players', value: `${server.state?.playerCount ?? 0} / ${server.state?.maxConnections ?? 0}` },
					{ label: 'Session', value: server.state?.session ?? 'N/A' },
				].map(({ label, value }) => (
					<div key={label}>
						<div className="text-xs text-subtle">{label}</div>
						<div className="text-sm font-semibold text-primary">{value}</div>
					</div>
				))}
			</div>

			<DeleteServerModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				server={server}
			/>
		</>
	);
}
