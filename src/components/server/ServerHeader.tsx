'use client';
import Link from 'next/link';
import { Server, serviceStatusToString, ServiceStatus } from '@/lib/schemas/server';
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
import { GhButton } from '@/components/ui/GhButton';

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
			{/* Topbar */}
			<header className="flex h-12 items-center justify-between border-b border-gh-border-muted px-5">
				<div className="flex items-center gap-2 text-sm">
					<Link href="/dashboard" className="text-gh-blue hover:underline">Servers</Link>
					<span className="text-gh-subtle">/</span>
					<span className="font-semibold text-gh-primary">{server.name}</span>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant={
						server.status === ServiceStatus.Running ? 'green' :
						server.status === ServiceStatus.Stopped ? 'gray' : 'yellow'
					}>
						● {serviceStatusToString(server.status)}
					</Badge>
					<GhButton variant="ghost" size="sm" onClick={startServer} disabled={server.status === ServiceStatus.Running || disabled || isPending}>Start</GhButton>
					<GhButton variant="ghost" size="sm" onClick={restartServer} disabled={server.status === ServiceStatus.Stopped || disabled || isPending}>Restart</GhButton>
					<GhButton variant="danger-outline" size="sm" onClick={stopServer} disabled={server.status === ServiceStatus.Stopped || disabled || isPending}>Stop</GhButton>
					{canDeleteServer && (
						<GhButton variant="danger-solid" size="sm" onClick={() => setIsDeleteModalOpen(true)} disabled={disabled || isPending}>Remove</GhButton>
					)}
				</div>
			</header>

			{/* Info strip */}
			<div className="flex flex-wrap gap-6 border-b border-gh-border-muted px-5 py-3">
				{[
					{ label: 'Track', value: server.state?.track ?? 'N/A' },
					{ label: 'Players', value: `${server.state?.playerCount ?? 0} / ${server.state?.maxConnections ?? 0}` },
					{ label: 'Session', value: server.state?.session ?? 'N/A' },
				].map(({ label, value }) => (
					<div key={label}>
						<div className="text-xs text-gh-subtle">{label}</div>
						<div className="text-sm font-semibold text-gh-primary">{value}</div>
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
