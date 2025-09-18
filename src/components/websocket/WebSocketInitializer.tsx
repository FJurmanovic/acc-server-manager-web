'use client';

import { useEffect, useRef } from 'react';
import { useWebSocket } from '@/lib/websocket/context';

interface WebSocketInitializerProps {
	openToken?: string;
}

export function WebSocketInitializer({ openToken }: WebSocketInitializerProps) {
	const { connect, isConnected } = useWebSocket();
	const hasInitialized = useRef(false);

	useEffect(() => {
		if (openToken && !isConnected && !hasInitialized.current) {
			hasInitialized.current = true;
			connect(openToken).catch((error) => {
				console.error('Failed to connect WebSocket:', error);
				hasInitialized.current = false;
			});
		}
	}, [openToken, connect, isConnected]);

	return null;
}
