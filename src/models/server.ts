interface State {
    session: string;
    playerCount: number;
    track: string;
    maxConnections: number;
}

export interface Server {
    id: number;
    name: string;
    status: string;
    state: State;
}
