'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useWebSocket } from '@/lib/websocket/context';
import { WebSocketMessage, StepData } from '@/lib/websocket/client';

interface SteamCMDContextType {
	isSteamCMDRunning: boolean;
	runningSteamServers: Set<string>;
	dissociateServer: (serverId: string) => void;
}

const SteamCMDContext = createContext<SteamCMDContextType | null>(null);

export function useSteamCMD() {
	const context = useContext(SteamCMDContext);
	if (!context) {
		throw new Error('useSteamCMD must be used within a SteamCMDProvider');
	}
	return context;
}

interface SteamCMDProviderProps {
	children: ReactNode;
}

export function SteamCMDProvider({ children }: SteamCMDProviderProps) {
	const [runningSteamServers, setRunningSteamServers] = useState<Set<string>>(new Set());
	const { addMessageHandler, removeMessageHandler } = useWebSocket();

	const isSteamCMDRunning = runningSteamServers.size > 0;

	useEffect(() => {
		const handleWebSocketMessage = (message: WebSocketMessage) => {
			if (message.type === 'step') {
				const data = message.data as StepData;

				if (data.step === 'steam_download') {
					setRunningSteamServers((prev) => {
						const newSet = new Set(prev);

						if (data.status === 'in_progress') {
							newSet.add(message.server_id);
						} else if (data.status === 'completed' || data.status === 'failed') {
							newSet.delete(message.server_id);
						}

						return newSet;
					});
				}
			}
		};

		addMessageHandler(handleWebSocketMessage);
		return () => {
			removeMessageHandler(handleWebSocketMessage);
		};
	}, [addMessageHandler, removeMessageHandler]);

	const dissociateServer = useCallback((serverId: string) => {
		setRunningSteamServers((prev) => {
			const newSet = new Set(prev);
			newSet.delete(serverId);
			return newSet;
		});
	}, []);

	return (
		<SteamCMDContext.Provider
			value={{
				isSteamCMDRunning,
				runningSteamServers,
				dissociateServer
			}}
		>
			{children}
		</SteamCMDContext.Provider>
	);
}
