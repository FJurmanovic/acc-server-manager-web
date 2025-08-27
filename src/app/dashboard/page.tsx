import { requireAuth } from '@/lib/auth/server';
import { getServers } from '@/lib/api/server/servers';
import { hasPermission } from '@/lib/types';
import { ServerCard } from '@/components/server/ServerCard';
import { logoutAction } from '@/lib/actions/auth';
import RefreshButton from '@/components/ui/RefreshButton';
import Link from 'next/link';

export default async function DashboardPage() {
	const session = await requireAuth();
	const servers = await getServers(session.token!);

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<header className="bg-gray-800 shadow-md">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
					<h1 className="text-2xl font-bold">ACC Server Manager</h1>
					<div className="flex items-center space-x-4">
						{hasPermission(session.user!, 'membership.view') && (
							<Link
								href="/dashboard/membership"
								className="flex items-center text-gray-300 hover:text-white"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 01-3-1.197"
									/>
								</svg>
								<span className="ml-1 hidden sm:inline">Users</span>
							</Link>
						)}
						<form action={logoutAction}>
							<button type="submit" className="flex items-center text-gray-300 hover:text-white">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
									/>
								</svg>
								<span className="ml-1 hidden sm:inline">Logout</span>
							</button>
						</form>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-xl font-semibold">Your Servers</h2>
					<RefreshButton />
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{servers.map((server) => (
						<ServerCard key={server.id} server={server} />
					))}
				</div>
			</main>
		</div>
	);
}
