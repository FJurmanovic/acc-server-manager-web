'use client';

import { useServerCreationPopup } from '@/lib/context/ServerCreationPopupContext';
import { ServerCreationPopup } from './ServerCreationPopup';
import { useSteamCMD } from '@/lib/context/SteamCMDContext';
import { useCallback } from 'react';

export function ServerCreationPopupContainer() {
	const { popup, hidePopup } = useServerCreationPopup();
	const { dissociateServer } = useSteamCMD();
	const handleClose = useCallback(() => {
		hidePopup();
		if (popup) return dissociateServer(popup.serverId);
	}, [popup, dissociateServer, hidePopup]);
	if (!popup) return null;

	const handleComplete = (success: boolean) => {
		if (success) {
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		}
	};

	return (
		<ServerCreationPopup
			serverId={popup.serverId}
			serverName={popup.serverName}
			isOpen={popup.isOpen}
			onClose={handleClose}
			onComplete={handleComplete}
		/>
	);
}
