import { requireAuth } from '@/lib/auth/server';
import { getServers } from '@/lib/api/server/servers';
import { ActivityLogTable } from '@/components/activityLog/ActivityLogTable';

export default async function ActivityLogPage() {
	const session = await requireAuth();
	const servers = await getServers(session.token!);
	const serverOptions = servers.map((s) => ({ id: s.id, name: s.name }));

	return (
		<main className="p-5">
			<h1 className="mb-5 text-lg font-semibold text-primary">Activity Log</h1>
			<ActivityLogTable servers={serverOptions} />
		</main>
	);
}
