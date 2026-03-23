'use server';

import { requireAuth } from '@/lib/auth/server';
import { getActivityLog, getGlobalActivityLog } from '@/lib/api/server/activityLog';
import type { ActivityLog, ActivityLogFilter } from '@/lib/schemas/activityLog';

export async function getActivityLogAction(
	serverId: string,
	filter?: ActivityLogFilter
): Promise<{ success: true; data: ActivityLog[] } | { success: false; message: string }> {
	try {
		const session = await requireAuth();
		const data = await getActivityLog(session.token!, serverId, filter);
		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to fetch activity log'
		};
	}
}

export async function getGlobalActivityLogAction(
	filter?: ActivityLogFilter
): Promise<{ success: true; data: ActivityLog[] } | { success: false; message: string }> {
	try {
		const session = await requireAuth();
		const data = await getGlobalActivityLog(session.token!, filter);
		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to fetch activity log'
		};
	}
}
