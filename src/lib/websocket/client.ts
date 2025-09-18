export interface WebSocketMessage {
	type: 'step' | 'steam_output' | 'error' | 'complete';
	server_id: string;
	timestamp: number;
	data: StepData | SteamOutputData | ErrorData | CompleteData;
}

export interface StepData {
	step:
		| 'validation'
		| 'directory_creation'
		| 'steam_download'
		| 'config_generation'
		| 'service_creation'
		| 'firewall_rules'
		| 'database_save'
		| 'completed';
	status: 'pending' | 'in_progress' | 'completed' | 'failed';
	message: string;
	error: string;
}

export interface SteamOutputData {
	output: string;
	is_error: boolean;
}

export interface ErrorData {
	error: string;
	details: string;
}

export interface CompleteData {
	server_id: string;
	success: boolean;
	message: string;
}

export type MessageHandler = (message: WebSocketMessage) => void;
export type ConnectionStatusHandler = (
	status: 'connecting' | 'connected' | 'disconnected' | 'error',
	error?: string
) => void;

export class WebSocketClient {
	private ws: WebSocket | null = null;
	private token: string;
	private messageHandlers: MessageHandler[] = [];
	private connectionStatusHandlers: ConnectionStatusHandler[] = [];
	private connectionPromise: Promise<void> | null = null;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 10;
	private reconnectDelay = 1000; // 1 second
	private maxReconnectDelay = 30000; // 30 seconds
	private reconnectTimer: NodeJS.Timeout | null = null;
	private shouldReconnect = true;
	private associatedServerId: string | null = null;
	private baseUrl: string;

	constructor(token: string, url: string) {
		this.token = token;
		this.baseUrl = url;
	}

	connect(): Promise<void> {
		if (this.connectionPromise) {
			return this.connectionPromise;
		}

		this.shouldReconnect = true;
		this.notifyStatus('connecting');

		this.connectionPromise = new Promise((resolve, reject) => {
			try {
				this.ws = new WebSocket(`${this.baseUrl}?token=${this.token}`);

				this.ws.onopen = () => {
					console.log('WebSocket connected');
					this.reconnectAttempts = 0;
					this.reconnectDelay = 5000;
					this.notifyStatus('connected');

					if (this.associatedServerId) {
						this.associateWithServer(this.associatedServerId);
					}

					resolve();
				};

				this.ws.onmessage = (event) => {
					try {
						const message: WebSocketMessage = JSON.parse(event.data);
						this.messageHandlers.forEach((handler) => handler(message));
					} catch (error) {
						console.error('Failed to parse WebSocket message:', error);
					}
				};

				this.ws.onclose = (event) => {
					console.log('WebSocket disconnected:', event.code, event.reason);
					this.connectionPromise = null;
					this.notifyStatus('disconnected');

					if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
						this.scheduleReconnect();
					}
				};

				this.ws.onerror = (error) => {
					console.error('WebSocket error:', error);
					this.notifyStatus('error', 'Connection failed');
					reject(error);
				};
			} catch (error) {
				this.notifyStatus('error', error instanceof Error ? error.message : 'Unknown error');
				reject(error);
			}
		});

		return this.connectionPromise;
	}

	associateWithServer(serverId: string): void {
		this.associatedServerId = serverId;
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(`server_id:${serverId}`);
		}
	}

	addMessageHandler(handler: MessageHandler): void {
		this.messageHandlers.push(handler);
	}

	removeMessageHandler(handler: MessageHandler): void {
		const index = this.messageHandlers.indexOf(handler);
		if (index > -1) {
			this.messageHandlers.splice(index, 1);
		}
	}

	disconnect(): void {
		this.shouldReconnect = false;
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
		this.connectionPromise = null;
		this.messageHandlers = [];
		this.connectionStatusHandlers = [];
		this.associatedServerId = null;
	}

	isConnected(): boolean {
		return this.ws?.readyState === WebSocket.OPEN;
	}

	addConnectionStatusHandler(handler: ConnectionStatusHandler): void {
		this.connectionStatusHandlers.push(handler);
	}

	removeConnectionStatusHandler(handler: ConnectionStatusHandler): void {
		const index = this.connectionStatusHandlers.indexOf(handler);
		if (index > -1) {
			this.connectionStatusHandlers.splice(index, 1);
		}
	}

	reconnect(): Promise<void> {
		this.disconnect();
		return this.connect();
	}

	private notifyStatus(
		status: 'connecting' | 'connected' | 'disconnected' | 'error',
		error?: string
	): void {
		this.connectionStatusHandlers.forEach((handler) => handler(status, error));
	}

	private scheduleReconnect(): void {
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
		}

		this.reconnectAttempts++;
		const delay = Math.min(
			this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
			this.maxReconnectDelay
		);

		console.log(
			`WebSocket reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`
		);

		this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = null;
			this.connect().catch((error) => {
				console.error('Reconnection failed:', error);
			});
		}, delay);
	}
}
