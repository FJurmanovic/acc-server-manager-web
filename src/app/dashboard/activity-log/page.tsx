import { requireAuth } from '@/lib/auth/server';
import { ActivityLogTable } from '@/components/activityLog/ActivityLogTable';

export default async function ActivityLogPage() {
	await requireAuth();

	return (
		<main className="p-5">
			<h1 className="mb-5 text-lg font-semibold text-primary">Activity Log</h1>
			<ActivityLogTable />
		</main>
	);
}
