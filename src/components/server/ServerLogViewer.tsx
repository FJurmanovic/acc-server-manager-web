'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useWebSocket } from '@/lib/websocket/context';
import type { WebSocketMessage } from '@/lib/schemas/websocket';
import { getServerLogAction } from '@/lib/actions/serverLog';

const MAX_BUFFER = 5000;
const LINE_OPTIONS = [100, 500, 1000, 5000] as const;

interface ServerLogViewerProps {
	serverId: string;
}

export function ServerLogViewer({ serverId }: ServerLogViewerProps) {
	const [lines, setLines] = useState<string[]>([]);
	const [initialLines, setInitialLines] = useState<number>(100);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isPaused, setIsPaused] = useState(false);

	const { associateWithServer, addMessageHandler, removeMessageHandler } = useWebSocket();
	const scrollRef = useRef<HTMLDivElement>(null);
	const isPausedRef = useRef(false);

	const appendLines = useCallback((newLines: string[]) => {
		setLines((prev) => {
			const combined = [...prev, ...newLines];
			return combined.length > MAX_BUFFER ? combined.slice(combined.length - MAX_BUFFER) : combined;
		});
	}, []);

	const fetchInitial = useCallback(
		async (count: number) => {
			setIsLoading(true);
			setError(null);
			const result = await getServerLogAction(serverId, count);
			setIsLoading(false);
			if (!result.success) {
				setError(result.message);
				return;
			}
			setLines(result.lines);
		},
		[serverId]
	);

	useEffect(() => {
		associateWithServer(serverId);
		fetchInitial(initialLines);
	}, [serverId, associateWithServer, fetchInitial, initialLines]);

	const handleMessage = useCallback(
		(message: WebSocketMessage) => {
			if (message.type !== 'log_line') return;
			if (message.server_id !== serverId) return;
			appendLines([message.data.line]);
		},
		[serverId, appendLines]
	);

	useEffect(() => {
		addMessageHandler(handleMessage);
		return () => {
			removeMessageHandler(handleMessage);
		};
	}, [addMessageHandler, removeMessageHandler, handleMessage]);

	// Auto-scroll to bottom when new lines arrive, unless paused
	useEffect(() => {
		if (!isPausedRef.current && scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [lines]);

	const handleScroll = () => {
		if (!scrollRef.current) return;
		const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
		const isAtBottom = scrollHeight - scrollTop - clientHeight < 40;
		const shouldPause = !isAtBottom;
		isPausedRef.current = shouldPause;
		setIsPaused(shouldPause);
	};

	const jumpToBottom = () => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
		isPausedRef.current = false;
		setIsPaused(false);
	};

	const handleLineLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const count = Number(e.target.value);
		setInitialLines(count);
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-3">
				<label className="text-xs text-subtle">Initial lines</label>
				<select
					value={initialLines}
					onChange={handleLineLimitChange}
					className="form-input w-28 text-sm"
				>
					{LINE_OPTIONS.map((n) => (
						<option key={n} value={n}>
							{n}
						</option>
					))}
				</select>
				<span className="ml-auto text-xs text-subtle">{lines.length} lines buffered</span>
			</div>

			{error && <p className="text-sm text-red">{error}</p>}

			<div className="relative">
				<div
					ref={scrollRef}
					onScroll={handleScroll}
					className="h-[calc(100vh-280px)] min-h-64 overflow-y-auto rounded-lg border border-border bg-base p-3 font-mono text-xs text-secondary"
				>
					{isLoading ? (
						<span className="text-muted">Loading…</span>
					) : lines.length === 0 ? (
						<span className="text-muted">No log output yet.</span>
					) : (
						lines.map((line, i) => (
							<div key={i} className="leading-5 whitespace-pre-wrap break-all">
								{line}
							</div>
						))
					)}
				</div>

				{isPaused && (
					<div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
						<div className="flex items-center gap-2 rounded-full border border-border bg-overlay px-3 py-1.5 shadow-lg">
							<span className="text-xs text-muted">Paused</span>
							<button
								onClick={jumpToBottom}
								className="text-xs font-medium text-blue hover:underline"
							>
								Jump to bottom
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
