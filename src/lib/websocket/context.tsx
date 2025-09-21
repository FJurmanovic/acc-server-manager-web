'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
	useCallback,
	useRef
} from 'react';
import { WebSocketClient, MessageHandler, ConnectionStatusHandler } from './client';
import { websocketOptions } from './config';

interface WebSocketContextType {
	client: WebSocketClient | null;
	isConnected: boolean;
	connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
	connectionError: string | null;
	connect: (token: string) => Promise<void>;
	disconnect: () => void;
	reconnect: () => Promise<void>;
	associateWithServer: (serverId: string) => void;
	addMessageHandler: (handler: MessageHandler) => void;
	removeMessageHandler: (handler: MessageHandler) => void;
	addConnectionStatusHandler: (handler: ConnectionStatusHandler) => void;
	removeConnectionStatusHandler: (handler: ConnectionStatusHandler) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function useWebSocket() {
	const context = useContext(WebSocketContext);
	if (!context) {
		throw new Error('useWebSocket must be used within a WebSocketProvider');
	}
	return context;
}

interface WebSocketProviderProps {
	children: ReactNode;
	openToken: string;
}

export function WebSocketProvider({ children, openToken }: WebSocketProviderProps) {
	const [client, setClient] = useState<WebSocketClient | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [connectionStatus, setConnectionStatus] = useState<
		'connecting' | 'connected' | 'disconnected' | 'error'
	>('disconnected');
	const [connectionError, setConnectionError] = useState<string | null>(null);

	const connect = useCallback(
		async (token: string) => {
			if (client?.isConnected()) {
				return;
			}

			if (client) {
				client.disconnect();
			}

			const newClient = new WebSocketClient(token, websocketOptions.url);

			const statusHandler: ConnectionStatusHandler = (status, error) => {
				setConnectionStatus(status);
				setIsConnected(status === 'connected');
				setConnectionError(error || null);
			};

			newClient.addConnectionStatusHandler(statusHandler);

			try {
				await newClient.connect();
				setClient(newClient);
			} catch (error) {
				console.error('Failed to connect WebSocket:', error);
				throw error;
			}
		},
		[client]
	);

	const disconnect = useCallback(() => {
		if (client) {
			client.disconnect();
			setClient(null);
			setIsConnected(false);
			setConnectionStatus('disconnected');
			setConnectionError(null);
		}
	}, [client]);

	const reconnect = useCallback(async () => {
		if (client) {
			try {
				await client.reconnect();
			} catch (error) {
				console.error('Failed to reconnect WebSocket:', error);
				throw error;
			}
		}
	}, [client]);
	const hasInitialized = useRef(false);

	const associateWithServer = useCallback(
		(serverId: string) => {
			if (openToken && !isConnected && !hasInitialized.current) {
				hasInitialized.current = true;
				connect(openToken).catch((error) => {
					console.error('Failed to connect WebSocket:', error);
					hasInitialized.current = false;
				});
			}
			if (client && isConnected) {
				client.associateWithServer(serverId);
			}
		},
		[client, isConnected, connect]
	);

	const addMessageHandler = useCallback(
		(handler: MessageHandler) => {
			if (client) {
				client.addMessageHandler(handler);
			}
		},
		[client]
	);

	const removeMessageHandler = useCallback(
		(handler: MessageHandler) => {
			if (client) {
				client.removeMessageHandler(handler);
			}
		},
		[client]
	);

	const addConnectionStatusHandler = useCallback(
		(handler: ConnectionStatusHandler) => {
			if (client) {
				client.addConnectionStatusHandler(handler);
			}
		},
		[client]
	);

	const removeConnectionStatusHandler = useCallback(
		(handler: ConnectionStatusHandler) => {
			if (client) {
				client.removeConnectionStatusHandler(handler);
			}
		},
		[client]
	);

	useEffect(() => {
		return () => {
			disconnect();
		};
	}, [disconnect]);

	return (
		<WebSocketContext.Provider
			value={{
				client,
				isConnected,
				connectionStatus,
				connectionError,
				connect,
				disconnect,
				reconnect,
				associateWithServer,
				addMessageHandler,
				removeMessageHandler,
				addConnectionStatusHandler,
				removeConnectionStatusHandler
			}}
		>
			{children}
		</WebSocketContext.Provider>
	);
}
