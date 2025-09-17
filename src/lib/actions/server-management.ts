'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth/server';
import { createServer, deleteServer } from '@/lib/api/server/servers';

export type ServerActionResult = {
	success: boolean;
	message: string;
	data?: any;
};

export async function createServerAction(
	prevState: ServerActionResult,
	formData: FormData
): Promise<ServerActionResult> {
	try {
		const session = await requireAuth();
		const name = formData.get('name') as string;

		if (!name?.trim()) {
			return {
				success: false,
				message: 'Server name is required'
			};
		}

		const server = await createServer(session.token!, name.trim());
		revalidatePath('/dashboard');

		return {
			success: true,
			message: 'Server creation started',
			data: server
		};
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to create server'
		};
	}
}

export async function deleteServerAction(serverId: string): Promise<ServerActionResult> {
	try {
		const session = await requireAuth();
		await deleteServer(session.token!, serverId);
		revalidatePath('/dashboard');

		return {
			success: true,
			message: 'Server deleted successfully'
		};
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to delete server'
		};
	}
}
