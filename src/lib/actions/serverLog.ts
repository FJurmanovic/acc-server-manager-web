'use server';

import { requireAuth } from '@/lib/auth/server';
import { getServerLog } from '@/lib/api/server/serverLog';

export async function getServerLogAction(
	serverId: string,
	lines: number = 100
): Promise<{ success: true; lines: string[] } | { success: false; message: string }> {
	try {
		const session = await requireAuth();
		const data = await getServerLog(session.token!, serverId, lines);
		return { success: true, lines: data };
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to fetch server log'
		};
	}
}
