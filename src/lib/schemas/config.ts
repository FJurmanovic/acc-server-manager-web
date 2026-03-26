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
	settings = 'settings',
	leaderboard = 'leaderboard',
	activityLog = 'activityLog',
	logs = 'logs'
}
export const serverTabSchema = z.enum(ServerTab);

export const configurationSchema = z.object({
	udpPort: z.number().min(1025).max(65535),
	tcpPort: z.number().min(1025).max(65535),
	maxConnections: z.number().min(1).max(100),
	lanDiscovery: z.number().min(0).max(1),
	registerToLobby: z.number().min(0).max(2),
	configVersion: z.number().min(1).max(2).default(1).optional()
});

export type Configuration = z.infer<typeof configurationSchema>;

export const assistRulesSchema = z.object({
	stabilityControlLevelMax: z.number().min(0).max(100).default(100),
	disableAutosteer: z.number().min(0).max(1).default(0),
	disableAutoLights: z.number().min(0).max(1).default(0),
	disableAutoWiper: z.number().min(0).max(1).default(0),
	disableAutoEngineStart: z.number().min(0).max(1).default(0),
	disableAutoPitLimiter: z.number().min(0).max(1).default(0),
	disableAutoGear: z.number().min(0).max(1).default(0),
	disableAutoClutch: z.number().min(0).max(1).default(0),
	disableIdealLine: z.number().min(0).max(1).default(0)
});

export type AssistRules = z.infer<typeof assistRulesSchema>;

export const serverSettingsSchema = z.object({
	serverName: z.string().min(3).max(150),
	adminPassword: z.string().min(6).max(50).or(z.literal('').nullable()),
	carGroup: z.string().min(1).max(50),
	trackMedalsRequirement: z.number().min(-1).max(3),
	safetyRatingRequirement: z.number().min(-1).max(99),
	racecraftRatingRequirement: z.number().min(-1).max(99),
	password: z.string().max(50).optional().or(z.literal('')),
	spectatorPassword: z.string().max(50).optional().or(z.literal('')),
	maxCarSlots: z.number().min(1).max(30),
	dumpLeaderboards: z.number().min(0).max(1).default(0),
	isRaceLocked: z.number().min(0).max(1).default(0),
	randomizeTrackWhenEmpty: z.number().min(0).max(1).default(0),
	centralEntryListPath: z.string().max(255).optional().or(z.literal('')),
	allowAutoDQ: z.number().min(0).max(1).default(0),
	shortFormationLap: z.number().min(0).max(1).default(0),
	dumpEntryList: z.number().min(0).max(1).default(0),
	formationLapType: z.number().min(0).max(3).default(3),
	ignorePrematureDisconnects: z.number().min(0).max(1).default(1)
});

export type ServerSettings = z.infer<typeof serverSettingsSchema>;

export const sessionSchema = z.object({
	hourOfDay: z.number().min(0).max(23).default(14),
	dayOfWeekend: z.number().min(1).max(3).default(1),
	timeMultiplier: z.number().min(0).max(24).default(1),
	sessionType: z.string().min(1).max(20),
	sessionDurationMinutes: z.number().min(1).max(180).default(20)
});

export type Session = z.infer<typeof sessionSchema>;

export const eventConfigSchema = z.object({
	track: z.string().min(1).max(100),
	preRaceWaitingTimeSeconds: z.number().min(30).max(600).default(30),
	sessionOverTimeSeconds: z.number().min(0).max(300).default(30),
	ambientTemp: z.number().min(0).max(50).default(24),
	cloudLevel: z.number().min(0).max(1).default(0),
	rain: z.number().min(0).max(1).default(0),
	weatherRandomness: z.number().min(0).max(7).default(0),
	postQualySeconds: z.number().min(0).max(600).default(30),
	postRaceSeconds: z.number().min(0).max(600).default(30),
	simracerWeatherConditions: z.number().min(0).max(1).default(0),
	isFixedConditionQualification: z.number().min(0).max(1).default(0),
	sessions: z.array(sessionSchema).min(1).max(10)
});

export type EventConfig = z.infer<typeof eventConfigSchema>;

export const eventRulesSchema = z.object({
	qualifyStandingType: z.preprocess((val) => {
		if (val == '') {
			return 1;
		}
		return val;
	}, z.number().min(1).max(2).default(1)),
	pitWindowLengthSec: z.number().min(-1).max(3600).default(-1),
	driverStintTimeSec: z.number().min(-1).max(7200).default(-1),
	mandatoryPitstopCount: z.number().min(0).max(5).default(0),
	maxTotalDrivingTime: z.number().min(-1).max(14400).default(-1),
	maxDriversCount: z.number().min(1).max(10).default(1),
	isRefuellingAllowedInRace: z.number().min(0).max(1).default(1),
	isRefuellingTimeFixed: z.number().min(0).max(1).default(0),
	isMandatoryPitstopRefuellingRequired: z.number().min(0).max(1).default(0),
	isMandatoryPitstopTyreChangeRequired: z.number().min(0).max(1).default(0),
	isMandatoryPitstopSwapDriverRequired: z.number().min(0).max(1).default(0),
	tyreSetCount: z.number().min(0).max(50).default(50)
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

export const SECTION_LABELS: Record<string, string> = {
	configuration: 'Configuration',
	assistRules: 'Assist Rules',
	event: 'Event Config',
	eventRules: 'Event Rules',
	settings: 'Server Settings'
};

export const FIELD_LABELS: Record<string, string> = {
	// configuration.json
	udpPort: 'UDP Port',
	tcpPort: 'TCP Port',
	maxConnections: 'Max Connections',
	lanDiscovery: 'LAN Discovery',
	registerToLobby: 'Register To Lobby',
	configVersion: 'Config Version',
	// assistRules.json
	stabilityControlLevelMax: 'Stability Control Level Max',
	disableAutosteer: 'Disable Autosteer',
	disableAutoLights: 'Disable Auto Lights',
	disableAutoWiper: 'Disable Auto Wiper',
	disableAutoEngineStart: 'Disable Auto Engine Start',
	disableAutoPitLimiter: 'Disable Auto Pit Limiter',
	disableAutoGear: 'Disable Auto Gear',
	disableAutoClutch: 'Disable Auto Clutch',
	disableIdealLine: 'Disable Ideal Line',
	// event.json
	track: 'Track',
	preRaceWaitingTimeSeconds: 'Pre-Race Waiting Time (seconds)',
	sessionOverTimeSeconds: 'Session Over Time (seconds)',
	ambientTemp: 'Ambient Temperature (°C)',
	cloudLevel: 'Cloud Level (0.0-1.0)',
	rain: 'Rain (0.0-1.0)',
	weatherRandomness: 'Weather Randomness',
	postQualySeconds: 'Post Qualify Seconds',
	postRaceSeconds: 'Post Race Seconds',
	simracerWeatherConditions: 'Simracer Weather Conditions',
	isFixedConditionQualification: 'Fixed Condition Qualification',
	sessions: 'Sessions',
	// eventRules.json
	qualifyStandingType: 'Qualify Standing Type',
	pitWindowLengthSec: 'Pit Window Length (seconds)',
	driverStintTimeSec: 'Driver Stint Time (seconds)',
	mandatoryPitstopCount: 'Mandatory Pitstop Count',
	maxTotalDrivingTime: 'Max Total Driving Time (seconds)',
	maxDriversCount: 'Max Drivers Count',
	isRefuellingAllowedInRace: 'Refuelling Allowed in Race',
	isRefuellingTimeFixed: 'Refuelling Time Fixed',
	isMandatoryPitstopRefuellingRequired: 'Mandatory Pitstop Refuelling Required',
	isMandatoryPitstopTyreChangeRequired: 'Mandatory Pitstop Tyre Change Required',
	isMandatoryPitstopSwapDriverRequired: 'Mandatory Pitstop Swap Driver Required',
	tyreSetCount: 'Tyre Set Count',
	// settings.json
	serverName: 'Server Name',
	adminPassword: 'Admin Password',
	carGroup: 'Car Group',
	trackMedalsRequirement: 'Track Medals Requirement',
	safetyRatingRequirement: 'Safety Rating Requirement',
	racecraftRatingRequirement: 'Racecraft Rating Requirement',
	password: 'Password',
	spectatorPassword: 'Spectator Password',
	maxCarSlots: 'Max Car Slots',
	dumpLeaderboards: 'Dump Leaderboards',
	isRaceLocked: 'Race Locked',
	randomizeTrackWhenEmpty: 'Randomize Track When Empty',
	centralEntryListPath: 'Central Entry List Path',
	allowAutoDQ: 'Allow Auto DQ',
	shortFormationLap: 'Short Formation Lap',
	dumpEntryList: 'Dump Entry List',
	formationLapType: 'Formation Lap Type',
	ignorePrematureDisconnects: 'Ignore Premature Disconnects'
};
