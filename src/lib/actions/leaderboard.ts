'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth/server';
import { fetchServerAPI } from '@/lib/api/server/base';
import { leaderboardSchema, type Leaderboard } from '@/lib/schemas/leaderboard';

export async function saveLeaderboardAction(serverId: string, data: Leaderboard) {
	try {
		const session = await requireAuth();
		const validated = leaderboardSchema.safeParse(data);
		if (!validated.success) {
			return { success: false, message: validated.error.message };
		}
		await fetchServerAPI(`/server/${serverId}/leaderboard`, session.token!, 'PUT', validated.data);
		revalidatePath(`/dashboard/server/${serverId}`);
		return { success: true, message: 'Leaderboard saved successfully' };
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to save leaderboard'
		};
	}
}
