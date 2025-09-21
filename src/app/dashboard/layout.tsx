import { WebSocketProvider } from '@/lib/websocket/context';
import { SteamCMDProvider } from '@/lib/context/SteamCMDContext';
import { ServerCreationPopupProvider } from '@/lib/context/ServerCreationPopupContext';
import { ServerCreationPopupContainer } from '@/components/server/ServerCreationPopupContainer';
import { requireAuth } from '@/lib/auth/server';

export default async function DashboardLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await requireAuth();
	return (
		<WebSocketProvider openToken={session.openToken!}>
			<SteamCMDProvider>
				<ServerCreationPopupProvider>
					{children}
					<ServerCreationPopupContainer />
				</ServerCreationPopupProvider>
			</SteamCMDProvider>
		</WebSocketProvider>
	);
}
