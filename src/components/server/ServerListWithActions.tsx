'use client';

import { useCallback, useState } from 'react';
import { Server, ServiceStatus } from '@/lib/schemas/server';
import { User, hasPermission } from '@/lib/schemas/user';
import { ServerCard } from './ServerCard';
import { ServerRow } from './ServerRow';
import { CreateServerModal } from './CreateServerModal';
import RefreshButton from '@/components/ui/RefreshButton';
import { useSteamCMD } from '@/lib/context/SteamCMDContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ServerListWithActionsProps {
	servers: Server[];
	user: User;
}

export function ServerListWithActions({ servers, user }: ServerListWithActionsProps) {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const { isSteamCMDRunning } = useSteamCMD();

	const handleOnClose = useCallback(() => setIsCreateModalOpen(false), []);
	const canCreateServer = hasPermission(user, 'server.create');

	const runningCount = servers.filter((s) => s.status === ServiceStatus.Running).length;
	const offlineCount = servers.filter((s) => s.status !== ServiceStatus.Running).length;

	return (
		<>
			<header className="border-border-muted flex h-12 items-center justify-between border-b px-5">
				<div className="flex items-center gap-3">
					<span className="text-primary text-sm font-semibold">Servers</span>
					<span className="text-muted text-xs">{servers.length} total</span>
				</div>
				<div className="flex items-center gap-2">
					<RefreshButton />
					{canCreateServer && (
						<Button
							variant="primary"
							size="sm"
							onClick={() => setIsCreateModalOpen(true)}
							disabled={isSteamCMDRunning}
							title={isSteamCMDRunning ? 'Disabled while SteamCMD is running' : undefined}
						>
							+ New Server
						</Button>
					)}
				</div>
			</header>

			<div className="flex items-center px-5 py-3">
				<div className="flex gap-2">
					{runningCount > 0 && <Badge variant="green">● {runningCount} running</Badge>}
					{offlineCount > 0 && <Badge variant="gray">{offlineCount} offline</Badge>}
				</div>
			</div>

			<div className="px-5 pb-5">
				{/* Card grid — desktop only */}
				<div
					className="hidden gap-3 md:grid"
					style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))' }}
				>
					{servers.map((server) => (
						<ServerCard key={server.id} server={server} />
					))}
				</div>
				{/* Row list — mobile only */}
				<div className="flex flex-col gap-2 md:hidden">
					{servers.map((server) => (
						<ServerRow key={server.id} server={server} />
					))}
				</div>
			</div>

			<CreateServerModal isOpen={isCreateModalOpen} onClose={handleOnClose} />
		</>
	);
}
