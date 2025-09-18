import Link from 'next/link';
import { useState, useTransition } from 'react';
import { Server, ServiceStatus, getStatusColor, serviceStatusToString } from '@/lib/types';
import { User, hasPermission } from '@/lib/types/user';
import {
	startServerEventAction,
	restartServerEventAction,
	stopServerEventAction
} from '@/lib/actions/servers';
import { DeleteServerModal } from './DeleteServerModal';
import { useRouter } from 'next/navigation';

interface ServerCardProps {
	server: Server;
	user: User;
}

export function ServerCard({ server, user }: ServerCardProps) {
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
			<div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-lg">
				<Link href={`/dashboard/server/${server.id}`} className="block">
					<div className="p-6">
						<div className="flex items-start justify-between">
							<div>
								<h3 className="text-lg font-medium text-white">{server.name}</h3>
								<div className="mt-2 flex items-center">
									<span
										className={`inline-block h-2 w-2 rounded-full ${getStatusColor(server.status)} mr-2`}
									/>
									<span className="text-sm text-gray-300 capitalize">
										{serviceStatusToString(server.status)}
									</span>
								</div>
							</div>
							<div className="flex items-center space-x-2">
								{canDeleteServer && (
									<button
										onClick={(e) => {
											e.preventDefault();
											setIsDeleteModalOpen(true);
										}}
										className="text-gray-400 hover:text-red-400"
										title="Delete Server"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 10-2 0v3a1 1 0 002 0V9z"
												clipRule="evenodd"
											/>
										</svg>
									</button>
								)}
								<div className="text-gray-400 hover:text-white">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
									</svg>
								</div>
							</div>
						</div>

						<div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-300">
							<div>
								<span className="text-gray-500">Track:</span>
								<span className="ml-2">{server.state?.track || 'N/A'}</span>
							</div>
							<div>
								<span className="text-gray-500">Players:</span>
								<span className="ml-2">{server.state?.playerCount || 0}</span>
							</div>
						</div>
					</div>
				</Link>

				<div className="flex justify-between gap-2 bg-gray-900 px-4 py-3">
					<button
						type="button"
						onClick={startServer}
						disabled={server.status === ServiceStatus.Running || isPending || disabled}
						className="rounded bg-green-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Start
					</button>

					<button
						type="button"
						onClick={restartServer}
						disabled={server.status === ServiceStatus.Stopped || isPending || disabled}
						className="rounded bg-yellow-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Restart
					</button>

					<button
						type="button"
						onClick={stopServer}
						disabled={server.status === ServiceStatus.Stopped || isPending || disabled}
						className="rounded bg-red-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Stop
					</button>
				</div>
			</div>

			<DeleteServerModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				server={server}
			/>
		</>
	);
}
