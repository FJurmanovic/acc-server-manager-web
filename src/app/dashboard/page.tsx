import { requireAuth } from '@/lib/auth/server';
import { getServers } from '@/lib/api/server/servers';
import { hasPermission } from '@/lib/schemas';
import Link from 'next/link';
import { ServerListWithActions } from '@/components/server/ServerListWithActions';
import { SteamCMDNotification } from '@/components/ui/SteamCMDNotification';
import LogoutButton from '@/components/ui/LogoutButton';

export default async function DashboardPage() {
	const session = await requireAuth();
	const servers = await getServers(session.token!);

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<header className="bg-gray-800 shadow-md">
				<div className="mx-auto flex max-w-[120rem] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
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
						<LogoutButton />
					</div>
				</div>
			</header>

			<SteamCMDNotification />

			<main className="mx-auto max-w-[120rem] px-4 py-8 sm:px-6 lg:px-8">
				<ServerListWithActions servers={servers} user={session.user!} />
			</main>
		</div>
	);
}
