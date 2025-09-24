import * as z from 'zod';

export enum ConfigFile {
	configuration = 'configuration.json',
	assistRules = 'assistRules.json',
	event = 'event.json',
	eventRules = 'eventRules.json',
	settings = 'settings.json'
}
export const configFileSchema = z.enum(ConfigFile);

export enum ServerTab {
	statistics = 'statistics',
	configuration = 'configuration',
	assistRules = 'assistRules',
	event = 'event',
	eventRules = 'eventRules',
	settings = 'settings'
}
export const serverTabSchema = z.enum(ServerTab);

export const configurationSchema = z.object({
	udpPort: z.number().min(1025).max(65535),
	tcpPort: z.number().min(1025).max(65535),
	maxConnections: z.number().min(1).max(64),
	lanDiscovery: z.number().min(0).max(1),
	registerToLobby: z.number().min(0).max(2),
	configVersion: z.number().min(1).max(2).default(1)
});

export type Configuration = z.infer<typeof configurationSchema>;

export const assistRulesSchema = z.object({
	stabilityControlLevelMax: z.number().min(0).max(3),
	disableAutosteer: z.number().min(0).max(1),
	disableAutoLights: z.number().min(0).max(1),
	disableAutoWiper: z.number().min(0).max(1),
	disableAutoEngineStart: z.number().min(0).max(1),
	disableAutoPitLimiter: z.number().min(0).max(1),
	disableAutoGear: z.number().min(0).max(1),
	disableAutoClutch: z.number().min(0).max(1),
	disableIdealLine: z.number().min(0).max(1)
});

export type AssistRules = z.infer<typeof assistRulesSchema>;

export const serverSettingsSchema = z.object({
	serverName: z.string().min(3).max(50),
	adminPassword: z.string().min(6).max(50),
	carGroup: z.string().min(1).max(50),
	trackMedalsRequirement: z.number().min(0).max(3),
	safetyRatingRequirement: z.number().min(0).max(5),
	racecraftRatingRequirement: z.number().min(0).max(5),
	password: z.string().max(50).optional().or(z.literal('')),
	spectatorPassword: z.string().max(50).optional().or(z.literal('')),
	maxCarSlots: z.number().min(1).max(64),
	dumpLeaderboards: z.number().min(0).max(1),
	isRaceLocked: z.number().min(0).max(1),
	randomizeTrackWhenEmpty: z.number().min(0).max(1),
	centralEntryListPath: z.string().max(255).optional().or(z.literal('')),
	allowAutoDQ: z.number().min(0).max(1),
	shortFormationLap: z.number().min(0).max(1),
	formationLapType: z.number().min(0).max(2),
	ignorePrematureDisconnects: z.number().min(0).max(1)
});

export type ServerSettings = z.infer<typeof serverSettingsSchema>;

export const sessionSchema = z.object({
	hourOfDay: z.number().min(0).max(23),
	dayOfWeekend: z.number().min(0).max(6),
	timeMultiplier: z.number().min(1).max(120),
	sessionType: z.string().min(1).max(20),
	sessionDurationMinutes: z.number().min(1).max(180)
});

export type Session = z.infer<typeof sessionSchema>;

export const eventConfigSchema = z.object({
	track: z.string().min(1).max(100),
	preRaceWaitingTimeSeconds: z.number().min(0).max(600),
	sessionOverTimeSeconds: z.number().min(0).max(300),
	ambientTemp: z.number().min(-20).max(50),
	cloudLevel: z.number().min(0).max(100),
	rain: z.number().min(0).max(100),
	weatherRandomness: z.number().min(0).max(100),
	postQualySeconds: z.number().min(0).max(600),
	postRaceSeconds: z.number().min(0).max(600),
	simracerWeatherConditions: z.number().min(0).max(2),
	isFixedConditionQualification: z.number().min(0).max(1),
	sessions: z.array(sessionSchema).min(1).max(10)
});

export type EventConfig = z.infer<typeof eventConfigSchema>;

export const eventRulesSchema = z.object({
	qualifyStandingType: z.number().min(0).max(2),
	pitWindowLengthSec: z.number().min(0).max(3600),
	driverStintTimeSec: z.number().min(0).max(7200),
	mandatoryPitstopCount: z.number().min(0).max(10),
	maxTotalDrivingTime: z.number().min(0).max(14400),
	isRefuellingAllowedInRace: z.boolean(),
	isRefuellingTimeFixed: z.boolean(),
	isMandatoryPitstopRefuellingRequired: z.boolean(),
	isMandatoryPitstopTyreChangeRequired: z.boolean(),
	isMandatoryPitstopSwapDriverRequired: z.boolean(),
	tyreSetCount: z.number().min(0).max(20)
});

export type EventRules = z.infer<typeof eventRulesSchema>;

export const configurationsSchema = z.object({
	configuration: configurationSchema,
	assistRules: assistRulesSchema,
	settings: serverSettingsSchema,
	event: eventConfigSchema,
	eventRules: eventRulesSchema
});

export type Configurations = z.infer<typeof configurationsSchema>;

export const configSchemaMap = {
	[ConfigFile.configuration]: configurationSchema,
	[ConfigFile.assistRules]: assistRulesSchema,
	[ConfigFile.event]: eventConfigSchema,
	[ConfigFile.eventRules]: eventRulesSchema,
	[ConfigFile.settings]: serverSettingsSchema
};

export type Config = Configuration | AssistRules | EventConfig | EventRules | ServerSettings;
