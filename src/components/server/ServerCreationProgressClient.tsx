'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWebSocket } from '@/lib/websocket/context';
import {
	WebSocketMessage,
	StepData,
	SteamOutputData,
	ErrorData,
	CompleteData
} from '@/lib/websocket/client';

interface ServerCreationProgressClientProps {
	serverId: string;
}

interface ConsoleEntry {
	id: string;
	timestamp: number;
	type: 'step' | 'steam_output' | 'error' | 'complete';
	content: string;
	level: 'info' | 'success' | 'warning' | 'error';
}

interface StepStatus {
	step: string;
	status: 'pending' | 'in_progress' | 'completed' | 'failed';
	message: string;
}

const STEPS = [
	{ key: 'validation', label: 'Validation' },
	{ key: 'directory_creation', label: 'Directory Creation' },
	{ key: 'steam_download', label: 'Steam Download' },
	{ key: 'config_generation', label: 'Config Generation' },
	{ key: 'service_creation', label: 'Service Creation' },
	{ key: 'firewall_rules', label: 'Firewall Rules' },
	{ key: 'database_save', label: 'Database Save' },
	{ key: 'completed', label: 'Completed' }
];

export function ServerCreationProgressClient({ serverId }: ServerCreationProgressClientProps) {
	const [entries, setEntries] = useState<ConsoleEntry[]>([]);
	const [steps, setSteps] = useState<Record<string, StepStatus>>({});
	const [isCompleted, setIsCompleted] = useState(false);
	const [completionResult, setCompletionResult] = useState<{
		success: boolean;
		message: string;
	} | null>(null);
	const [isMinimized, setIsMinimized] = useState(false);

	const {
		associateWithServer,
		addMessageHandler,
		removeMessageHandler,
		connectionStatus,
		connectionError,
		reconnect
	} = useWebSocket();
	const router = useRouter();
	const consoleRef = useRef<HTMLDivElement>(null);

	const addEntry = (entry: Omit<ConsoleEntry, 'id'>) => {
		const newEntry = {
			...entry,
			id: `${Date.now()}-${Math.random()}`
		};
		setEntries((prev) => [...prev, newEntry]);
	};

	const scrollToBottom = () => {
		if (consoleRef.current && !isMinimized) {
			consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [entries, isMinimized]);

	useEffect(() => {
		if (serverId) {
			associateWithServer(serverId);
		}
	}, [serverId, associateWithServer]);

	useEffect(() => {
		const handleMessage = (message: WebSocketMessage) => {
			if (message.server_id !== serverId) return;

			const timestamp = message.timestamp;

			switch (message.type) {
				case 'step': {
					const data = message.data as StepData;
					setSteps((prev) => ({
						...prev,
						[data.step]: {
							step: data.step,
							status: data.status,
							message: data.message
						}
					}));

					let level: ConsoleEntry['level'] = 'info';
					if (data.status === 'completed') level = 'success';
					else if (data.status === 'failed') level = 'error';
					else if (data.status === 'in_progress') level = 'warning';

					addEntry({
						timestamp,
						type: 'step',
						content: `[${data.step.toUpperCase()}] ${data.message}${data.error ? ` - ${data.error}` : ''}`,
						level
					});
					break;
				}

				case 'steam_output': {
					const data = message.data as SteamOutputData;
					addEntry({
						timestamp,
						type: 'steam_output',
						content: data.output,
						level: data.is_error ? 'error' : 'info'
					});
					break;
				}

				case 'error': {
					const data = message.data as ErrorData;
					addEntry({
						timestamp,
						type: 'error',
						content: `ERROR: ${data.error}${data.details ? ` - ${data.details}` : ''}`,
						level: 'error'
					});
					break;
				}

				case 'complete': {
					const data = message.data as CompleteData;
					setIsCompleted(true);
					setCompletionResult({ success: data.success, message: data.message });

					addEntry({
						timestamp,
						type: 'complete',
						content: `COMPLETED: ${data.message}`,
						level: data.success ? 'success' : 'error'
					});
					break;
				}
			}
		};

		addMessageHandler(handleMessage);
		return () => {
			removeMessageHandler(handleMessage);
		};
	}, [addMessageHandler, removeMessageHandler, serverId]);

	const handleReturnToDashboard = () => {
		router.push('/dashboard');
	};

	const handleReconnect = async () => {
		try {
			await reconnect();
		} catch (error) {
			console.error('Failed to reconnect:', error);
		}
	};

	const getStepStatusIcon = (status: StepStatus['status']) => {
		switch (status) {
			case 'pending':
				return '⏳';
			case 'in_progress':
				return '🔄';
			case 'completed':
				return '✅';
			case 'failed':
				return '❌';
		}
	};

	const getEntryClassName = (level: ConsoleEntry['level']) => {
		switch (level) {
			case 'success':
				return 'text-green-400';
			case 'warning':
				return 'text-yellow-400';
			case 'error':
				return 'text-red-400';
			default:
				return 'text-gray-300';
		}
	};

	const getConnectionStatusColor = () => {
		switch (connectionStatus) {
			case 'connected':
				return 'text-green-400';
			case 'connecting':
				return 'text-yellow-400';
			case 'disconnected':
				return 'text-gray-400';
			case 'error':
				return 'text-red-400';
		}
	};

	const getConnectionStatusIcon = () => {
		switch (connectionStatus) {
			case 'connected':
				return '🟢';
			case 'connecting':
				return '🟡';
			case 'disconnected':
				return '⚫';
			case 'error':
				return '🔴';
		}
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			{/* Header */}
			<header className="bg-gray-800 shadow-md">
				<div className="mx-auto flex max-w-[120rem] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex items-center space-x-4">
						<Link
							href="/dashboard"
							className="text-gray-400 hover:text-white"
							title="Back to Dashboard"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
						</Link>
						<h1 className="text-xl font-bold">Server Creation Progress</h1>
					</div>
					<div className="flex items-center space-x-4">
						{/* Connection Status */}
						<div className="flex items-center space-x-2">
							<span className="text-lg">{getConnectionStatusIcon()}</span>
							<span className={`text-sm ${getConnectionStatusColor()}`}>
								{connectionStatus === 'connected' && 'Connected'}
								{connectionStatus === 'connecting' && 'Connecting...'}
								{connectionStatus === 'disconnected' && 'Disconnected'}
								{connectionStatus === 'error' && 'Connection Error'}
							</span>
							{(connectionStatus === 'disconnected' || connectionStatus === 'error') && (
								<button
									onClick={handleReconnect}
									className="rounded bg-blue-600 px-2 py-1 text-xs hover:bg-blue-700"
									title="Reconnect to WebSocket"
								>
									Reconnect
								</button>
							)}
						</div>

						<button
							onClick={() => setIsMinimized(!isMinimized)}
							className="text-gray-400 hover:text-white"
							title={isMinimized ? 'Expand Console' : 'Minimize Console'}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								{isMinimized ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M7 14l3-3 3 3"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M17 10l-3 3-3-3"
									/>
								)}
							</svg>
						</button>
						{isCompleted && (
							<button
								onClick={handleReturnToDashboard}
								className={`rounded-md px-4 py-2 text-sm font-medium ${
									completionResult?.success
										? 'bg-green-600 hover:bg-green-700'
										: 'bg-red-600 hover:bg-red-700'
								}`}
							>
								{completionResult?.success ? 'Return to Dashboard' : 'Back to Dashboard'}
							</button>
						)}
					</div>
				</div>
			</header>

			{/* Connection Error Banner */}
			{(connectionStatus === 'disconnected' || connectionStatus === 'error') && (
				<div className="border-l-4 border-red-400 bg-red-600 p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<div className="flex-shrink-0">
								<svg className="h-5 w-5 text-red-50" viewBox="0 0 20 20" fill="currentColor">
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<p className="text-sm text-red-50">
									<strong>WebSocket Connection Lost</strong> -
									{connectionError
										? ` ${connectionError}`
										: ' Unable to receive real-time updates.'}{' '}
									Progress may not be current.
								</p>
							</div>
						</div>
						<button
							onClick={handleReconnect}
							className="rounded bg-red-700 px-3 py-1 text-sm text-red-50 hover:bg-red-800"
						>
							Reconnect
						</button>
					</div>
				</div>
			)}

			<main className="mx-auto max-w-[120rem] px-4 py-6 sm:px-6 lg:px-8">
				<div className="space-y-6">
					{/* Steps Progress */}
					<div className="rounded-lg bg-gray-800 p-6">
						<h2 className="mb-4 text-lg font-medium text-gray-300">Progress Steps</h2>
						<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
							{STEPS.map(({ key, label }) => {
								const stepStatus = steps[key];
								return (
									<div
										key={key}
										className={`flex items-center space-x-3 rounded-lg p-3 text-sm ${
											stepStatus?.status === 'completed'
												? 'bg-green-900/50 text-green-100'
												: stepStatus?.status === 'in_progress'
													? 'bg-yellow-900/50 text-yellow-100'
													: stepStatus?.status === 'failed'
														? 'bg-red-900/50 text-red-100'
														: 'bg-gray-700 text-gray-300'
										}`}
									>
										<span className="text-lg">
											{getStepStatusIcon(stepStatus?.status || 'pending')}
										</span>
										<span className="font-medium">{label}</span>
									</div>
								);
							})}
						</div>
					</div>

					{/* Console Output */}
					{!isMinimized && (
						<div className="rounded-lg bg-gray-800">
							<div className="flex items-center justify-between border-b border-gray-700 p-4">
								<h2 className="text-lg font-medium text-gray-300">Console Output</h2>
								<div className="text-sm text-gray-400">{entries.length} log entries</div>
							</div>
							<div className="h-96 overflow-hidden rounded-b-lg bg-black p-4">
								<div
									ref={consoleRef}
									className="h-full space-y-1 overflow-y-auto font-mono text-sm"
								>
									{entries.map((entry) => (
										<div
											key={entry.id}
											className={`${getEntryClassName(entry.level)} leading-tight`}
										>
											<span className="text-xs text-gray-500">
												{new Date(entry.timestamp * 1000).toLocaleTimeString()}
											</span>{' '}
											<span>{entry.content}</span>
										</div>
									))}
									{entries.length === 0 && (
										<div className="py-8 text-center text-gray-500">
											Waiting for server creation to begin...
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{isMinimized && (
						<div className="rounded-lg bg-gray-800 p-4">
							<div className="text-center text-gray-400">
								Console minimized - click the expand button in the header to view output
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
