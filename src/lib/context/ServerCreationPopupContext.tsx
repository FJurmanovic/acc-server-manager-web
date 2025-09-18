'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ServerCreationPopupState {
	serverId: string;
	serverName: string;
	isOpen: boolean;
}

interface ServerCreationPopupContextType {
	popup: ServerCreationPopupState | null;
	showPopup: (serverId: string, serverName: string) => void;
	hidePopup: () => void;
	isPopupOpen: boolean;
}

const ServerCreationPopupContext = createContext<ServerCreationPopupContextType | null>(null);

export function useServerCreationPopup() {
	const context = useContext(ServerCreationPopupContext);
	if (!context) {
		throw new Error('useServerCreationPopup must be used within a ServerCreationPopupProvider');
	}
	return context;
}

interface ServerCreationPopupProviderProps {
	children: ReactNode;
}

export function ServerCreationPopupProvider({ children }: ServerCreationPopupProviderProps) {
	const [popup, setPopup] = useState<ServerCreationPopupState | null>(null);

	const showPopup = useCallback((serverId: string, serverName: string) => {
		setPopup({
			serverId,
			serverName,
			isOpen: true
		});
	}, []);

	const hidePopup = useCallback(() => {
		setPopup(null);
	}, []);

	const isPopupOpen = popup?.isOpen || false;

	return (
		<ServerCreationPopupContext.Provider
			value={{
				popup,
				showPopup,
				hidePopup,
				isPopupOpen
			}}
		>
			{children}
		</ServerCreationPopupContext.Provider>
	);
}
