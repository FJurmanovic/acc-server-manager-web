'use client';

import { useServerCreationPopup } from '@/lib/context/ServerCreationPopupContext';
import { ServerCreationPopup } from './ServerCreationPopup';

export function ServerCreationPopupContainer() {
  const { popup, hidePopup } = useServerCreationPopup();

  if (!popup) return null;

  const handleComplete = (success: boolean, message: string) => {
    // Refresh the page on successful completion to show the new server
    if (success) {
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Wait 2 seconds to let user see the success message
    }
  };

  return (
    <ServerCreationPopup
      serverId={popup.serverId}
      serverName={popup.serverName}
      isOpen={popup.isOpen}
      onClose={hidePopup}
      onComplete={handleComplete}
    />
  );
}
