import type { ServiceStatus } from '$lib/types/serviceStatus';

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
