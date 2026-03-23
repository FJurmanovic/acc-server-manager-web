'use server';

import { requireAuth } from '@/lib/auth/server';
import { getActivityLog } from '@/lib/api/server/activityLog';
import type { ActivityLog, ActivityLogFilter } from '@/lib/schemas/activityLog';

export async function getActivityLogAction(
	filter?: ActivityLogFilter
): Promise<{ success: true; data: ActivityLog[] } | { success: false; message: string }> {
	try {
		const session = await requireAuth();
		const data = await getActivityLog(session.token!, filter);
		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to fetch activity log'
		};
	}
}
