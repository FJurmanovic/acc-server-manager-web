'use client';

import { useEffect } from 'react';
import { useWebSocket } from '@/lib/websocket/context';

interface WebSocketInitializerProps {
	openToken?: string;
}

export function WebSocketInitializer({ openToken }: WebSocketInitializerProps) {
	const { connect, disconnect, isConnected } = useWebSocket();

	useEffect(() => {
		console.log({ openToken, connect, disconnect, isConnected });
		if (openToken && !isConnected) {
			connect(openToken).catch((error) => {
				console.error('Failed to connect WebSocket:', error);
			});
		}

		return () => {
			disconnect();
		};
	}, [openToken, connect, disconnect, isConnected]);

	return null; // This component doesn't render anything
}
