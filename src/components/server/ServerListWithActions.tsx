'use client';

import { useCallback, useState } from 'react';
import { Server } from '@/lib/types/server';
import { User, hasPermission } from '@/lib/types/user';
import { ServerCard } from './ServerCard';
import { CreateServerModal } from './CreateServerModal';
import RefreshButton from '@/components/ui/RefreshButton';
import { useSteamCMD } from '@/lib/context/SteamCMDContext';

interface ServerListWithActionsProps {
	servers: Server[];
	user: User;
}

export function ServerListWithActions({ servers, user }: ServerListWithActionsProps) {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const { isSteamCMDRunning } = useSteamCMD();

	const handleOnClose = useCallback(() => setIsCreateModalOpen(false), []);
	const canCreateServer = hasPermission(user, 'server.create');

	return (
		<>
			<div className="mb-6 flex items-center justify-between">
				<h2 className="text-xl font-semibold">Your Servers</h2>
				<div className="flex items-center space-x-4">
					{canCreateServer && (
						<button
							onClick={() => setIsCreateModalOpen(true)}
							disabled={isSteamCMDRunning}
							className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
							title={isSteamCMDRunning ? 'Server creation disabled while SteamCMD is running' : ''}
						>
							Create Server
						</button>
					)}
					<RefreshButton />
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{servers.map((server) => (
					<ServerCard key={server.id} server={server} user={user} />
				))}
			</div>

			<CreateServerModal isOpen={isCreateModalOpen} onClose={handleOnClose} />
		</>
	);
}
