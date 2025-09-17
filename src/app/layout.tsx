import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { WebSocketProvider } from '@/lib/websocket/context';
import { SteamCMDProvider } from '@/lib/context/SteamCMDContext';
import { ServerCreationPopupProvider } from '@/lib/context/ServerCreationPopupContext';
import { ServerCreationPopupContainer } from '@/components/server/ServerCreationPopupContainer';

export const metadata: Metadata = {
	title: 'ACC Server Manager',
	description: 'Assetto Corsa Competizione Server Management Interface'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="bg-gray-900 text-white antialiased">
				<QueryProvider>
					<WebSocketProvider>
						<SteamCMDProvider>
							<ServerCreationPopupProvider>
								{children}
								<ServerCreationPopupContainer />
							</ServerCreationPopupProvider>
						</SteamCMDProvider>
					</WebSocketProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
