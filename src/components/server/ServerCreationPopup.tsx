'use client';

import { useEffect, useRef, useState } from 'react';
import { useWebSocket } from '@/lib/websocket/context';
import {
	WebSocketMessage,
	StepData,
	SteamOutputData,
	ErrorData,
	CompleteData
} from '@/lib/websocket/client';

interface ServerCreationPopupProps {
	serverId: string;
	serverName: string;
	isOpen: boolean;
	onClose: () => void;
	onComplete?: (success: boolean, message: string) => void;
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

export function ServerCreationPopup({
	serverId,
	serverName,
	isOpen,
	onClose,
	onComplete
}: ServerCreationPopupProps) {
	const [entries, setEntries] = useState<ConsoleEntry[]>([]);
	const [steps, setSteps] = useState<Record<string, StepStatus>>({});
	const [isCompleted, setIsCompleted] = useState(false);
	const [completionResult, setCompletionResult] = useState<{
		success: boolean;
		message: string;
	} | null>(null);
	const [isMinimized, setIsMinimized] = useState(false);
	const [isConsoleVisible, setIsConsoleVisible] = useState(true);

	const {
		associateWithServer,
		addMessageHandler,
		removeMessageHandler,
		connectionStatus,
		connectionError,
		reconnect
	} = useWebSocket();

	const consoleRef = useRef<HTMLDivElement>(null);

	const addEntry = (entry: Omit<ConsoleEntry, 'id'>) => {
		const newEntry = {
			...entry,
			id: `${Date.now()}-${Math.random()}`
		};
		setEntries((prev) => [...prev, newEntry]);
	};

	const scrollToBottom = () => {
		if (consoleRef.current && !isMinimized && isConsoleVisible) {
			consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [entries, isMinimized, isConsoleVisible]);

	useEffect(() => {
		if (serverId && isOpen) {
			associateWithServer(serverId);
		}
	}, [serverId, isOpen, associateWithServer]);

	useEffect(() => {
		const handleMessage = (message: WebSocketMessage) => {
			// Only handle messages for this server
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

					onComplete?.(data.success, data.message);
					break;
				}
			}
		};

		if (isOpen) {
			addMessageHandler(handleMessage);
			return () => {
				removeMessageHandler(handleMessage);
			};
		}
	}, [addMessageHandler, removeMessageHandler, serverId, isOpen, onComplete]);

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

	const getCurrentProgress = () => {
		const completedSteps = Object.values(steps).filter(
			(step) => step.status === 'completed'
		).length;
		const totalSteps = STEPS.length;
		return { completed: completedSteps, total: totalSteps };
	};

	if (!isOpen) return null;

	// Minimized state - circular icon in bottom corner
	if (isMinimized) {
		const progress = getCurrentProgress();
		const isProgressing =
			!isCompleted && Object.values(steps).some((step) => step.status === 'in_progress');

		return (
			<div className="fixed right-4 bottom-4 z-50">
				<button
					onClick={() => setIsMinimized(false)}
					className={`flex h-16 w-16 items-center justify-center rounded-full border-2 shadow-lg transition-all hover:scale-105 ${
						isCompleted
							? completionResult?.success
								? 'border-green-400 bg-green-600 hover:bg-green-700'
								: 'border-red-400 bg-red-600 hover:bg-red-700'
							: 'border-blue-400 bg-blue-600 hover:bg-blue-700'
					}`}
					title={`Server Creation: ${serverName} - ${progress.completed}/${progress.total} steps`}
				>
					<div className="text-center text-white">
						{isCompleted ? (
							<span className="text-2xl">{completionResult?.success ? '✅' : '❌'}</span>
						) : (
							<>
								<div className="text-xs font-bold">
									{progress.completed}/{progress.total}
								</div>
								{isProgressing && <div className="animate-pulse text-xs">⚡</div>}
							</>
						)}
					</div>

					{/* Progress ring */}
					{!isCompleted && (
						<svg className="absolute inset-0 h-16 w-16 -rotate-90 transform">
							<circle
								cx="32"
								cy="32"
								r="28"
								stroke="currentColor"
								strokeWidth="4"
								fill="none"
								className="text-gray-300 opacity-20"
							/>
							<circle
								cx="32"
								cy="32"
								r="28"
								stroke="currentColor"
								strokeWidth="4"
								fill="none"
								strokeDasharray={`${(progress.completed / progress.total) * 175.929} 175.929`}
								className="text-white transition-all duration-500"
							/>
						</svg>
					)}
				</button>
			</div>
		);
	}

	// Expanded popup state
	return (
		<div className="fixed right-4 bottom-4 z-50 max-h-[600px] w-96 rounded-lg border border-gray-700 bg-gray-800 shadow-2xl select-none">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-gray-700 p-4">
				<div className="flex items-center space-x-2">
					<span className="text-lg">🔧</span>
					<h3 className="truncate font-medium text-white">{serverName}</h3>
				</div>

				<div className="flex items-center space-x-2">
					{/* Connection Status */}
					<div className="flex items-center space-x-1">
						<span className="text-sm">{getConnectionStatusIcon()}</span>
						{(connectionStatus === 'disconnected' || connectionStatus === 'error') && (
							<button
								onClick={handleReconnect}
								className="rounded bg-blue-600 px-1 py-0.5 text-xs hover:bg-blue-700"
								title="Reconnect"
							>
								🔄
							</button>
						)}
					</div>

					{/* Console Toggle */}
					<button
						onClick={() => setIsConsoleVisible(!isConsoleVisible)}
						className="text-sm text-gray-400 hover:text-white"
						title={isConsoleVisible ? 'Hide Console' : 'Show Console'}
					>
						{isConsoleVisible ? '📋' : '📋'}
					</button>

					{/* Minimize */}
					<button
						onClick={() => setIsMinimized(true)}
						className="text-gray-400 hover:text-white"
						title="Minimize"
					>
						<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
						</svg>
					</button>

					{/* Close */}
					{isCompleted && (
						<button onClick={onClose} className="text-gray-400 hover:text-white" title="Close">
							<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					)}
				</div>
			</div>

			{/* Connection Error Banner */}
			{(connectionStatus === 'disconnected' || connectionStatus === 'error') && (
				<div className="bg-red-600 p-2 text-xs text-red-50">
					<div className="flex items-center justify-between">
						<span>Connection lost - {connectionError || 'Reconnecting...'}</span>
						<button onClick={handleReconnect} className="underline">
							Reconnect
						</button>
					</div>
				</div>
			)}

			{/* Steps Progress */}
			<div className="border-b border-gray-700 p-4">
				<div className="grid grid-cols-2 gap-2">
					{STEPS.map(({ key, label }) => {
						const stepStatus = steps[key];
						return (
							<div
								key={key}
								className={`flex items-center space-x-2 rounded p-2 text-xs ${
									stepStatus?.status === 'completed'
										? 'bg-green-900/50 text-green-100'
										: stepStatus?.status === 'in_progress'
											? 'bg-yellow-900/50 text-yellow-100'
											: stepStatus?.status === 'failed'
												? 'bg-red-900/50 text-red-100'
												: 'bg-gray-700 text-gray-300'
								}`}
							>
								<span>{getStepStatusIcon(stepStatus?.status || 'pending')}</span>
								<span className="truncate">{label}</span>
							</div>
						);
					})}
				</div>
			</div>

			{/* Console Output */}
			{isConsoleVisible && (
				<div className="h-64 bg-black">
					<div ref={consoleRef} className="h-full space-y-1 overflow-y-auto p-3 font-mono text-xs">
						{entries.map((entry) => (
							<div key={entry.id} className={`${getEntryClassName(entry.level)} leading-tight`}>
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
			)}

			{/* Completion Status */}
			{isCompleted && (
				<div
					className={`p-3 text-center text-sm ${
						completionResult?.success
							? 'bg-green-900/50 text-green-100'
							: 'bg-red-900/50 text-red-100'
					}`}
				>
					{completionResult?.message}
				</div>
			)}
		</div>
	);
}
