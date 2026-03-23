import * as z from 'zod';

export const actionTypeSchema = z.enum([
	'config_update',
	'server_start',
	'server_stop',
	'server_restart',
	'leaderboard_update'
]);

export type ActionType = z.infer<typeof actionTypeSchema>;

export const activityLogSchema = z.object({
	id: z.string(),
	serverId: z.string(),
	userId: z.string(),
	username: z.string(),
	action: actionTypeSchema,
	details: z.string(),
	createdAt: z.string()
});

export type ActivityLog = z.infer<typeof activityLogSchema>;

export const lastActivityInfoSchema = z.object({
	updatedAt: z.string(),
	username: z.string(),
	action: actionTypeSchema
});

export type LastActivityInfo = z.infer<typeof lastActivityInfoSchema>;

export const activityLogFilterSchema = z.object({
	page: z.number().optional(),
	page_size: z.number().optional(),
	sort_by: z.string().optional(),
	sort_desc: z.boolean().optional(),
	user_id: z.string().optional(),
	action: actionTypeSchema.optional(),
	start_date: z.string().optional(),
	end_date: z.string().optional()
});

export type ActivityLogFilter = z.infer<typeof activityLogFilterSchema>;

export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
	config_update: 'Config Update',
	server_start: 'Server Start',
	server_stop: 'Server Stop',
	server_restart: 'Server Restart',
	leaderboard_update: 'Leaderboard Update'
};
