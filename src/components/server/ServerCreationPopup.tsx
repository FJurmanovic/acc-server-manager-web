'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useWebSocket } from '@/lib/websocket/context';
import type {
	WebSocketMessage,
	StepData,
	SteamOutputData,
	ErrorData,
	CompleteData
} from '@/lib/schemas/websocket';

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
		reconnect
	} = useWebSocket();

	const consoleRef = useRef<HTMLDivElement>(null);

	const addEntry = useCallback((entry: Omit<ConsoleEntry, 'id'>) => {
		const newEntry = {
			...entry,
			id: `${Date.now()}-${Math.random()}`
		};
		setEntries((prev) => [...prev, newEntry]);
	}, []);

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

	const handleMessage = useCallback(
		(message: WebSocketMessage) => {
			if (message.server_id !== serverId) return;

			const timestamp = message.timestamp;

			switch (message.type) {
				case 'step': {
					const data = message.data as StepData;
					setSteps((prev) => {
						const updatedSteps = { ...prev };

						const stepIndex = STEPS.findIndex((step) => step.key === data.step);
						if (stepIndex > 0) {
							for (let i = 0; i < stepIndex; i++) {
								const prevStepKey = STEPS[i].key;
								if (!updatedSteps[prevStepKey] || updatedSteps[prevStepKey].status === 'pending') {
									updatedSteps[prevStepKey] = {
										step: prevStepKey,
										status: 'completed',
										message: `${prevStepKey.replace('_', ' ')} completed`
									};
								}
							}
						}

						updatedSteps[data.step] = {
							step: data.step,
							status: data.status,
							message: data.message
						};

						return updatedSteps;
					});

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

					setSteps((prev) => {
						const updatedSteps = { ...prev };

						if (
							!updatedSteps['steam_download'] ||
							updatedSteps['steam_download'].status === 'pending'
						) {
							updatedSteps['steam_download'] = {
								step: 'steam_download',
								status: 'in_progress',
								message: 'Steam download in progress'
							};
						}

						if (!updatedSteps['validation'] || updatedSteps['validation'].status === 'pending') {
							updatedSteps['validation'] = {
								step: 'validation',
								status: 'completed',
								message: 'Validation completed'
							};
						}

						if (
							!updatedSteps['directory_creation'] ||
							updatedSteps['directory_creation'].status === 'pending'
						) {
							updatedSteps['directory_creation'] = {
								step: 'directory_creation',
								status: 'completed',
								message: 'Directory creation completed'
							};
						}

						return updatedSteps;
					});

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

					setSteps((prev) => {
						const updatedSteps = { ...prev };
						const currentStep = Object.values(updatedSteps).find(
							(step) => step.status === 'in_progress'
						);
						if (currentStep) {
							updatedSteps[currentStep.step] = {
								...currentStep,
								status: 'failed',
								message: `${currentStep.step.replace('_', ' ')} failed: ${data.error}`
							};
						}
						return updatedSteps;
					});

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
		},
		[serverId, addEntry, onComplete]
	);

	useEffect(() => {
		if (isOpen) {
			addMessageHandler(handleMessage);
			return () => {
				removeMessageHandler(handleMessage);
			};
		}
	}, [addMessageHandler, removeMessageHandler, handleMessage, isOpen]);

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

	if (isMinimized) {
		const progress = getCurrentProgress();
		const isProgressing =
			!isCompleted && Object.values(steps).some((step) => step.status === 'in_progress');

		return (
			<div className="fixed right-4 bottom-4 z-40">
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

	return (
		<div className="fixed right-4 bottom-4 z-40 max-h-[600px] w-96 rounded-lg border border-gray-700 bg-gray-800 shadow-2xl select-none">
			<div className="flex items-center justify-between border-b border-gray-700 p-4">
				<div className="flex items-center space-x-2">
					<span className="text-lg">🔧</span>
					<h3 className="truncate font-medium text-white">{serverName}</h3>
				</div>

				<div className="flex items-center space-x-2">
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

					<button
						onClick={() => setIsConsoleVisible(!isConsoleVisible)}
						className="text-sm text-gray-400 hover:text-white"
						title={isConsoleVisible ? 'Hide Console' : 'Show Console'}
					>
						📋
					</button>

					<button
						onClick={() => setIsMinimized(true)}
						className="text-gray-400 hover:text-white"
						title="Minimize"
					>
						<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
						</svg>
					</button>

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
				</div>
			</div>

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
