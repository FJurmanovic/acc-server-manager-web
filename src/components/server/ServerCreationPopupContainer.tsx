'use client';

import { useServerCreationPopup } from '@/lib/context/ServerCreationPopupContext';
import { ServerCreationPopup } from './ServerCreationPopup';
import { useSteamCMD } from '@/lib/context/SteamCMDContext';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function ServerCreationPopupContainer() {
	const { popup, hidePopup } = useServerCreationPopup();
	const { dissociateServer } = useSteamCMD();
	const router = useRouter();
	const handleClose = useCallback(() => {
		hidePopup();
		if (popup) return dissociateServer(popup.serverId);
	}, [popup, dissociateServer, hidePopup]);
	if (!popup) return null;

	const handleComplete = (success: boolean) => {
		if (success) {
			setTimeout(() => {
				router.refresh();
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
