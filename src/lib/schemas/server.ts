import * as z from 'zod';

export enum ServiceStatus {
	Unknown,
	Stopped,
	Stopping,
	Restarting,
	Starting,
	Running
}
export const serviceStatusSchema = z.enum(ServiceStatus);

export const serviceStatusToString = (status: ServiceStatus): string => {
	switch (status) {
		case ServiceStatus.Running:
			return 'Running';
		case ServiceStatus.Stopped:
			return 'Stopped';
		case ServiceStatus.Starting:
			return 'Starting';
		case ServiceStatus.Stopping:
			return 'Stopping';
		case ServiceStatus.Restarting:
			return 'Restarting';
		default:
			return 'Unknown';
	}
};

export const getStatusColor = (status: ServiceStatus): string => {
	switch (status) {
		case ServiceStatus.Running:
			return 'bg-green-500';
		case ServiceStatus.Stopped:
			return 'bg-red-500';
		case ServiceStatus.Starting:
			return 'bg-blue-500';
		case ServiceStatus.Stopping:
			return 'bg-yellow-500';
		case ServiceStatus.Restarting:
			return 'bg-purple-500';
		default:
			return 'bg-gray-500';
	}
};

export const stateSchema = z.object({
	session: z.string(),
	playerCount: z.number().min(0),
	track: z.string(),
	maxConnections: z.number().min(0)
});

export type State = z.infer<typeof stateSchema>;

export const serverSchema = z.object({
	id: z.uuid(),
	name: z.string().min(1),
	status: z.enum(ServiceStatus),
	state: stateSchema.optional().nullable()
});

export type Server = z.infer<typeof serverSchema>;
