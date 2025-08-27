'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth/server';
import { startService, stopService, restartService } from '@/lib/api/server/servers';

export async function startServerAction(serverId: string) {
	try {
		const session = await requireAuth();
		await startService(session.token!, serverId);
		revalidatePath('/dashboard');
		revalidatePath(`/dashboard/server/${serverId}`);
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to start server'
		};
	}
}

export async function stopServerAction(serverId: string) {
	try {
		const session = await requireAuth();
		await stopService(session.token!, serverId);
		revalidatePath('/dashboard');
		revalidatePath(`/dashboard/server/${serverId}`);
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to stop server'
		};
	}
}

export async function restartServerAction(serverId: string) {
	try {
		const session = await requireAuth();
		await restartService(session.token!, serverId);
		revalidatePath('/dashboard');
		revalidatePath(`/dashboard/server/${serverId}`);
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to restart server'
		};
	}
}
