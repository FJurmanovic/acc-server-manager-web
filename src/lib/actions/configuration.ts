'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth/server';
import { updateServerConfiguration } from '@/lib/api/server/configuration';
import {
	assistRulesSchema,
	ConfigFile,
	eventConfigSchema,
	eventRulesSchema,
	serverSettingsSchema
} from '@/lib/schemas/config';
import type {
	Configuration,
	AssistRules,
	EventConfig,
	EventRules,
	ServerSettings
} from '@/lib/schemas/config';

export async function updateConfigurationAction(serverId: string, formData: FormData) {
	try {
		const session = await requireAuth();
		const restart = formData.get('restart') === 'on';

		const config: Configuration = {
			udpPort: parseInt(formData.get('udpPort') as string),
			tcpPort: parseInt(formData.get('tcpPort') as string),
			maxConnections: parseInt(formData.get('maxConnections') as string),
			lanDiscovery: parseInt(formData.get('lanDiscovery') as string),
			registerToLobby: parseInt(formData.get('registerToLobby') as string),
			configVersion: parseInt(formData.get('configVersion') as string) || 1
		};

		await updateServerConfiguration(
			session.token!,
			serverId,
			ConfigFile.configuration,
			config,
			restart
		);
		revalidatePath(`/dashboard/server/${serverId}`);

		return { success: true, message: 'Configuration updated successfully' };
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to update configuration'
		};
	}
}

export async function updateAssistRulesAction(serverId: string, formData: FormData) {
	try {
		const session = await requireAuth();
		const restart = formData.get('restart') === 'on';

		const rawConfig: AssistRules = {
			stabilityControlLevelMax: parseInt(formData.get('stabilityControlLevelMax') as string),
			disableAutosteer: parseInt(formData.get('disableAutosteer') as string),
			disableAutoLights: parseInt(formData.get('disableAutoLights') as string),
			disableAutoWiper: parseInt(formData.get('disableAutoWiper') as string),
			disableAutoEngineStart: parseInt(formData.get('disableAutoEngineStart') as string),
			disableAutoPitLimiter: parseInt(formData.get('disableAutoPitLimiter') as string),
			disableAutoGear: parseInt(formData.get('disableAutoGear') as string),
			disableAutoClutch: parseInt(formData.get('disableAutoClutch') as string),
			disableIdealLine: parseInt(formData.get('disableIdealLine') as string)
		};

		const config = assistRulesSchema.safeParse(rawConfig);
		if (!config.success) {
			return { success: false, message: config.error.message };
		}

		await updateServerConfiguration(
			session.token!,
			serverId,
			ConfigFile.assistRules,
			config.data,
			restart
		);
		revalidatePath(`/dashboard/server/${serverId}`);

		return { success: true, message: 'Assist rules updated successfully' };
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to update assist rules'
		};
	}
}

export async function updateServerSettingsAction(serverId: string, formData: FormData) {
	try {
		const session = await requireAuth();
		const restart = formData.get('restart') === 'on';

		const rawConfig: ServerSettings = {
			serverName: formData.get('serverName') as string,
			adminPassword: formData.get('adminPassword') as string,
			carGroup: formData.get('carGroup') as string,
			trackMedalsRequirement: parseInt(formData.get('trackMedalsRequirement') as string),
			safetyRatingRequirement: parseInt(formData.get('safetyRatingRequirement') as string),
			racecraftRatingRequirement: parseInt(formData.get('racecraftRatingRequirement') as string),
			password: formData.get('password') as string,
			spectatorPassword: formData.get('spectatorPassword') as string,
			maxCarSlots: parseInt(formData.get('maxCarSlots') as string),
			dumpLeaderboards: parseInt(formData.get('dumpLeaderboards') as string),
			isRaceLocked: parseInt(formData.get('isRaceLocked') as string),
			randomizeTrackWhenEmpty: parseInt(formData.get('randomizeTrackWhenEmpty') as string),
			centralEntryListPath: formData.get('centralEntryListPath') as string,
			allowAutoDQ: parseInt(formData.get('allowAutoDQ') as string),
			shortFormationLap: parseInt(formData.get('shortFormationLap') as string),
			formationLapType: parseInt(formData.get('formationLapType') as string),
			ignorePrematureDisconnects: parseInt(formData.get('ignorePrematureDisconnects') as string)
		};
		const config = serverSettingsSchema.safeParse(rawConfig);
		if (!config.success) {
			return { success: false, message: config.error.message };
		}

		await updateServerConfiguration(
			session.token!,
			serverId,
			ConfigFile.settings,
			config.data,
			restart
		);
		revalidatePath(`/dashboard/server/${serverId}`);

		return { success: true, message: 'Server settings updated successfully' };
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to update server settings'
		};
	}
}

export async function updateEventConfigAction(serverId: string, formData: FormData) {
	try {
		const session = await requireAuth();
		const restart = formData.get('restart') === 'on';

		const sessionsData = formData.get('sessions') as string;
		const sessions = sessionsData ? JSON.parse(sessionsData) : [];

		const rawConfig: EventConfig = {
			track: formData.get('track') as string,
			preRaceWaitingTimeSeconds: parseInt(formData.get('preRaceWaitingTimeSeconds') as string),
			sessionOverTimeSeconds: parseInt(formData.get('sessionOverTimeSeconds') as string),
			ambientTemp: parseInt(formData.get('ambientTemp') as string),
			cloudLevel: parseFloat(formData.get('cloudLevel') as string),
			rain: parseFloat(formData.get('rain') as string),
			weatherRandomness: parseInt(formData.get('weatherRandomness') as string),
			postQualySeconds: parseInt(formData.get('postQualySeconds') as string),
			postRaceSeconds: parseInt(formData.get('postRaceSeconds') as string),
			simracerWeatherConditions: parseInt(formData.get('simracerWeatherConditions') as string),
			isFixedConditionQualification: parseInt(
				formData.get('isFixedConditionQualification') as string
			),
			sessions
		};
		const config = eventConfigSchema.safeParse(rawConfig);
		if (!config.success) {
			return { success: false, message: config.error.message };
		}

		await updateServerConfiguration(
			session.token!,
			serverId,
			ConfigFile.event,
			config.data,
			restart
		);
		revalidatePath(`/dashboard/server/${serverId}`);

		return {
			success: true,
			message: 'Event configuration updated successfully'
		};
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to update event configuration'
		};
	}
}

export async function updateEventRulesAction(serverId: string, formData: FormData) {
	try {
		const session = await requireAuth();
		const restart = formData.get('restart') === 'on';

		const rawConfig: EventRules = {
			qualifyStandingType: parseInt(formData.get('qualifyStandingType') as string),
			pitWindowLengthSec: parseInt(formData.get('pitWindowLengthSec') as string),
			driverStintTimeSec: parseInt(formData.get('driverStintTimeSec') as string),
			mandatoryPitstopCount: parseInt(formData.get('mandatoryPitstopCount') as string),
			maxTotalDrivingTime: parseInt(formData.get('maxTotalDrivingTime') as string),
			isRefuellingAllowedInRace: formData.get('isRefuellingAllowedInRace') === 'true',
			isRefuellingTimeFixed: formData.get('isRefuellingTimeFixed') === 'true',
			isMandatoryPitstopRefuellingRequired:
				formData.get('isMandatoryPitstopRefuellingRequired') === 'true',
			isMandatoryPitstopTyreChangeRequired:
				formData.get('isMandatoryPitstopTyreChangeRequired') === 'true',
			isMandatoryPitstopSwapDriverRequired:
				formData.get('isMandatoryPitstopSwapDriverRequired') === 'true',
			tyreSetCount: parseInt(formData.get('tyreSetCount') as string)
		};

		const config = eventRulesSchema.safeParse(rawConfig);
		if (!config.success) {
			return { success: false, message: config.error.message };
		}

		await updateServerConfiguration(
			session.token!,
			serverId,
			ConfigFile.eventRules,
			config.data,
			restart
		);
		revalidatePath(`/dashboard/server/${serverId}`);

		return { success: true, message: 'Event rules updated successfully' };
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to update event rules'
		};
	}
}
