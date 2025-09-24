import * as z from 'zod';

// Step data schema
export const stepDataSchema = z.object({
	step: z.enum([
		'validation',
		'directory_creation',
		'steam_download',
		'config_generation',
		'service_creation',
		'firewall_rules',
		'database_save',
		'completed'
	]),
	status: z.enum(['pending', 'in_progress', 'completed', 'failed']),
	message: z.string(),
	error: z.string()
});

export type StepData = z.infer<typeof stepDataSchema>;

// Steam output data schema
export const steamOutputDataSchema = z.object({
	output: z.string(),
	is_error: z.boolean()
});

export type SteamOutputData = z.infer<typeof steamOutputDataSchema>;

// Error data schema
export const errorDataSchema = z.object({
	error: z.string(),
	details: z.string()
});

export type ErrorData = z.infer<typeof errorDataSchema>;

// Complete data schema
export const completeDataSchema = z.object({
	server_id: z.string(),
	success: z.boolean(),
	message: z.string()
});

export type CompleteData = z.infer<typeof completeDataSchema>;

// WebSocket message schema using discriminated union
export const webSocketMessageSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('step'),
		server_id: z.string(),
		timestamp: z.number(),
		data: stepDataSchema
	}),
	z.object({
		type: z.literal('steam_output'),
		server_id: z.string(),
		timestamp: z.number(),
		data: steamOutputDataSchema
	}),
	z.object({
		type: z.literal('error'),
		server_id: z.string(),
		timestamp: z.number(),
		data: errorDataSchema
	}),
	z.object({
		type: z.literal('complete'),
		server_id: z.string(),
		timestamp: z.number(),
		data: completeDataSchema
	})
]);

export type WebSocketMessage = z.infer<typeof webSocketMessageSchema>;

// Connection status schema
export const connectionStatusSchema = z.enum(['connecting', 'connected', 'disconnected', 'error']);

export type ConnectionStatus = z.infer<typeof connectionStatusSchema>;

// Handler types (these remain as types since they're function signatures)
export type MessageHandler = (message: WebSocketMessage) => void;
export type ConnectionStatusHandler = (
	status: ConnectionStatus,
	error?: string
) => void;
