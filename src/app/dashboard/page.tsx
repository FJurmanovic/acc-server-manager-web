import { requireAuth } from '@/lib/auth/server';
import { getServers } from '@/lib/api/server/servers';
import { ServerListWithActions } from '@/components/server/ServerListWithActions';
import { SteamCMDNotification } from '@/components/ui/SteamCMDNotification';

export default async function DashboardPage() {
	const session = await requireAuth();
	const servers = await getServers(session.token!);

	return (
		<main>
			<SteamCMDNotification />
			<ServerListWithActions servers={servers} user={session.user!} />
		</main>
	);
}
