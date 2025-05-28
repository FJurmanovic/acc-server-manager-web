export interface Configurations {
	configuration: Configuration;
	assistRules: AssistRules;
	event: EventConfig;
	eventRules: EventRules;
	settings: ServerSettings;
}

export enum configFile {
	configuration = 'configuration.json',
	assistRules = 'assistRules.json',
	event = 'event.json',
	eventRules = 'eventRules.json',
	settings = 'settings.json'
}
export enum serverTab {
	statistics = 'statistics',
	configuration = 'configuration',
	assistRules = 'assistRules',
	event = 'event',
	eventRules = 'eventRules',
	settings = 'settings'
}

export interface StateHistory {
	dateCreated: string;
	sessionStart: string;
	playerCount: number;
	track: string;
	sessionDurationMinutes: number;
	session: string;
}

export type Config = Configuration | AssistRules | EventConfig | EventRules | ServerSettings;
export type ConfigFile =
	| configFile.configuration
	| configFile.assistRules
	| configFile.event
	| configFile.eventRules
	| configFile.settings;

export interface AssistRules {
	stabilityControlLevelMax: number;
	disableAutosteer: number;
	disableAutoLights: number;
	disableAutoWiper: number;
	disableAutoEngineStart: number;
	disableAutoPitLimiter: number;
	disableAutoGear: number;
	disableAutoClutch: number;
	disableIdealLine: number;
}

export interface ServerSettings {
	serverName: string;
	adminPassword: string;
	carGroup: string;
	trackMedalsRequirement: number;
	safetyRatingRequirement: number;
	racecraftRatingRequirement: number;
	password: string;
	spectatorPassword: string;
	maxCarSlots: number;
	dumpLeaderboards: number;
	isRaceLocked: number;
	randomizeTrackWhenEmpty: number;
	centralEntryListPath: string;
	allowAutoDQ: number;
	shortFormationLap: number;
	formationLapType: number;
	ignorePrematureDisconnects: number;
}

export interface Configuration {
	udpPort: number;
	tcpPort: number;
	maxConnections: number;
	lanDiscovery: number;
	registerToLobby: number;
	configVersion: number;
}

export interface EventConfig {
	track: string;
	preRaceWaitingTimeSeconds: number;
	sessionOverTimeSeconds: number;
	ambientTemp: number;
	cloudLevel: number;
	rain: number;
	weatherRandomness: number;
	postQualySeconds: number;
	postRaceSeconds: number;
	simracerWeatherConditions: number;
	isFixedConditionQualification: number;
	sessions: Session[];
}

export interface Session {
	hourOfDay: number;
	dayOfWeekend: number;
	timeMultiplier: number;
	sessionType: string;
	sessionDurationMinutes: number;
}

export interface EventRules {
	qualifyStandingType: number;
	pitWindowLengthSec: number;
	driverStintTimeSec: number;
	mandatoryPitstopCount: number;
	maxTotalDrivingTime: number;
	isRefuellingAllowedInRace: boolean;
	isRefuellingTimeFixed: boolean;
	isMandatoryPitstopRefuellingRequired: boolean;
	isMandatoryPitstopTyreChangeRequired: boolean;
	isMandatoryPitstopSwapDriverRequired: boolean;
	tyreSetCount: number;
}
