import { requireAuth } from '@/lib/auth/server';
import { getServer } from '@/lib/api/server/servers';
import { getServerConfigurations } from '@/lib/api/server/configuration';
import { ServerConfigurationTabs } from '@/components/server/ServerConfigurationTabs';
import { ServerHeader } from '@/components/server/ServerHeader';
import { getServerStatistics } from '@/lib/api/server/statistics';
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

	const [server, configurations, statistics] = await Promise.all([
		getServer(session.token!, id),
		getServerConfigurations(session.token!, id),
		getServerStatistics(session.token!, id, { startDate, endDate })
	]);

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<div className="mx-auto max-w-[120rem] px-4 py-8 sm:px-6 lg:px-8">
				<ServerHeader server={server} user={session.user!} />

				<div className="mt-8">
					<ServerConfigurationTabs
						serverId={id}
						configurations={configurations}
						statistics={statistics}
					/>
				</div>
			</div>
		</div>
	);
}
