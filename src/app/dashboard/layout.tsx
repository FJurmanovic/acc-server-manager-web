import { WebSocketProvider } from '@/lib/websocket/context';
import { SteamCMDProvider } from '@/lib/context/SteamCMDContext';
import { ServerCreationPopupProvider } from '@/lib/context/ServerCreationPopupContext';
import { ServerCreationPopupContainer } from '@/components/server/ServerCreationPopupContainer';
import { requireAuth } from '@/lib/auth/server';
import { AppShell } from '@/components/ui/AppShell';
import { hasPermission } from '@/lib/schemas';

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const session = await requireAuth();
	const showUsers = hasPermission(session.user!, 'membership.view');
	return (
		<WebSocketProvider openToken={session.openToken!}>
			<SteamCMDProvider>
				<ServerCreationPopupProvider>
					<AppShell showUsers={showUsers}>
						{children}
						<ServerCreationPopupContainer />
					</AppShell>
				</ServerCreationPopupProvider>
			</SteamCMDProvider>
		</WebSocketProvider>
	);
}
