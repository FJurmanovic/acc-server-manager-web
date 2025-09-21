import type { Metadata } from 'next';
import './globals.css';

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
			<body className="bg-gray-900 text-white antialiased">{children}</body>
		</html>
	);
}
