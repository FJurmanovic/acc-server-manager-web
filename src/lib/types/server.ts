import type { ServiceStatus } from './serviceStatus';

export interface ServerState {
	session: string;
	sessionStart: string;
	playerCount: number;
	track: string;
	maxConnections: number;
}

export interface Server {
	id: number;
	name: string;
	status: ServiceStatus;
	state: ServerState;
}

// Helper function to parse server data from API
export const parseServer = (data: any): Server => {
	return {
		id: data.id,
		name: data.name,
		status: data.status,
		state: {
			session: data.state.session,
			sessionStart: data.state.sessionStart,
			playerCount: data.state.playerCount,
			track: data.state.track,
			maxConnections: data.state.maxConnections
		}
	};
};
