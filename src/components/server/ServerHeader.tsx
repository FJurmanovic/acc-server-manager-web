import Link from 'next/link';
import { Server, getStatusColor, serviceStatusToString, ServiceStatus } from '@/lib/types/server';
import {
	startServerEventAction,
	restartServerEventAction,
	stopServerEventAction
} from '@/lib/actions/servers';

interface ServerHeaderProps {
	server: Server;
}

export function ServerHeader({ server }: ServerHeaderProps) {
	return (
		<div className="rounded-lg bg-gray-800 p-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<Link
						href="/dashboard"
						className="flex items-center text-gray-400 transition-colors hover:text-white"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="mr-2 h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Back to Dashboard
					</Link>
				</div>
			</div>

			<div className="mt-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-white">{server.name}</h1>
						<div className="mt-2 flex items-center">
							<span
								className={`inline-block h-3 w-3 rounded-full ${getStatusColor(server.status)} mr-3`}
							/>
							<span className="text-lg text-gray-300 capitalize">
								{serviceStatusToString(server.status)}
							</span>
						</div>
					</div>

					<div className="flex space-x-3">
						<form action={startServerEventAction.bind(null, server.id)}>
							<button
								type="submit"
								disabled={server.status === ServiceStatus.Running}
								className="rounded bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Start
							</button>
						</form>

						<form action={restartServerEventAction.bind(null, server.id)}>
							<button
								type="submit"
								disabled={server.status === ServiceStatus.Stopped}
								className="rounded bg-yellow-600 px-4 py-2 font-medium text-white transition-colors hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Restart
							</button>
						</form>

						<form action={stopServerEventAction.bind(null, server.id)}>
							<button
								type="submit"
								disabled={server.status === ServiceStatus.Stopped}
								className="rounded bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Stop
							</button>
						</form>
					</div>
				</div>

				<div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
					<div>
						<div className="text-sm text-gray-500">Current Track</div>
						<div className="text-lg font-medium text-white">{server.state?.track || 'N/A'}</div>
					</div>
					<div>
						<div className="text-sm text-gray-500">Players</div>
						<div className="text-lg font-medium text-white">
							{server.state?.playerCount || 0} / {server.state?.maxConnections || 0}
						</div>
					</div>
					<div>
						<div className="text-sm text-gray-500">Session</div>
						<div className="text-lg font-medium text-white">{server.state?.session || 'N/A'}</div>
					</div>
					<div>
						<div className="text-sm text-gray-500">Max Connections</div>
						<div className="text-lg font-medium text-white">
							{server.state?.maxConnections || 0}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
