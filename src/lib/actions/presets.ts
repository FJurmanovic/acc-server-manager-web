'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth/server';
import { listPresets, createPreset, applyPreset, type ConfigPresetCreateRequest } from '@/lib/api/server/presets';
import type { ConfigPreset } from '@/lib/schemas/preset';

export async function listPresetsAction(
	name?: string
): Promise<{ success: true; data: ConfigPreset[] } | { success: false; message: string }> {
	try {
		const session = await requireAuth();
		const data = await listPresets(session.token!, name);
		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to fetch presets'
		};
	}
}

export async function createPresetAction(
	data: ConfigPresetCreateRequest
): Promise<{ success: true; data: ConfigPreset } | { success: false; message: string }> {
	try {
		const session = await requireAuth();
		const preset = await createPreset(session.token!, data);
		return { success: true, data: preset };
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to save preset'
		};
	}
}

export async function applyPresetAction(
	serverId: string,
	presetId: string,
	restart = false
): Promise<{ success: true; message: string } | { success: false; message: string }> {
	try {
		const session = await requireAuth();
		await applyPreset(session.token!, serverId, presetId, restart);
		revalidatePath(`/dashboard/server/${serverId}`);
		return { success: true, message: 'Preset applied successfully' };
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to apply preset'
		};
	}
}
