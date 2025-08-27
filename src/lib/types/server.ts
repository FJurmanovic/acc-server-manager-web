export enum ServiceStatus {
	Unknown,
	Stopped,
	Stopping,
	Restarting,
	Starting,
	Running
}

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

interface State {
	session: string;
	playerCount: number;
	track: string;
	maxConnections: number;
}

export interface Server {
	id: string;
	name: string;
	status: ServiceStatus;
	state: State;
}
