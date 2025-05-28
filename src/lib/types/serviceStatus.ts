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

export const parseServiceStatus = (status: string): ServiceStatus => {
	switch (status) {
		case 'Running':
			return ServiceStatus.Running;
		case 'SERVICE_STOPPED':
			return ServiceStatus.Stopped;
		case 'SERVICE_STARTING':
			return ServiceStatus.Starting;
		case 'SERVICE_STOPPING':
			return ServiceStatus.Stopping;
		case 'SERVICE_RESTARTING':
			return ServiceStatus.Restarting;
		default:
			return ServiceStatus.Unknown;
	}
};

export const getStatusColor = (status: ServiceStatus): string => {
	switch (status) {
		case ServiceStatus.Running:
			return 'text-green-500';
		case ServiceStatus.Stopped:
			return 'text-red-500';
		case ServiceStatus.Starting:
			return 'text-blue-500';
		case ServiceStatus.Stopping:
			return 'text-yellow-500';
		case ServiceStatus.Restarting:
			return 'text-purple-500';
		default:
			return 'text-gray-500';
	}
};

export const getStatusIcon = (status: ServiceStatus): string => {
	switch (status) {
		case ServiceStatus.Running:
			return '🟢'; // or use an icon library like 'play-circle'
		case ServiceStatus.Stopped:
			return '🔴'; // or 'stop-circle'
		case ServiceStatus.Starting:
			return '🔵'; // or 'arrow-up-circle'
		case ServiceStatus.Stopping:
			return '🟡'; // or 'arrow-down-circle'
		case ServiceStatus.Restarting:
			return '🟣'; // or 'refresh-circle'
		default:
			return '⚪'; // or 'help-circle'
	}
};
