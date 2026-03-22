import { requireAuth } from '@/lib/auth/server';
import { getServer } from '@/lib/api/server/servers';
import { getServerConfigurations } from '@/lib/api/server/configuration';
import { ServerConfigurationTabs } from '@/components/server/ServerConfigurationTabs';
import { ServerHeader } from '@/components/server/ServerHeader';
import { getServerStatistics } from '@/lib/api/server/statistics';
import { getLeaderboard } from '@/lib/api/server/leaderboard';
import { subDays, formatISO } from 'date-fns';
import { UTCDate } from '@date-fns/utc';

interface ServerPageProps {
	params: { id: string };
}

export default async function ServerPage({ params }: ServerPageProps) {
	const { id } = await params;
	const session = await requireAuth();

	const today = new UTCDate();
	const endDate = formatISO(today);
	const startDate = formatISO(subDays(today, 30));

	const [server, configurations, statistics, leaderboard] = await Promise.all([
		getServer(session.token!, id),
		getServerConfigurations(session.token!, id),
		getServerStatistics(session.token!, id, { startDate, endDate }),
		getLeaderboard(session.token!, id)
	]);

	return (
		<div className="flex flex-col overflow-hidden h-screen">
			<ServerHeader server={server} user={session.user!} />
			<ServerConfigurationTabs
				serverId={id}
				configurations={configurations}
				statistics={statistics}
				leaderboard={leaderboard}
			/>
		</div>
	);
}
