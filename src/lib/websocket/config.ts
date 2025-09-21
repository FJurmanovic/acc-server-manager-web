export interface WebsocketOptions {
	url: string;
}

export const websocketOptions: WebsocketOptions = {
	url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3000/ws'
};
