'use client';

import { useState, useEffect, useCallback } from 'react';
import { getActivityLogAction } from '@/lib/actions/activityLog';
import type { ActivityLog, ActivityLogFilter, ActionType } from '@/lib/schemas/activityLog';
import { ACTION_TYPE_LABELS, actionTypeSchema } from '@/lib/schemas/activityLog';
import { Button } from '@/components/ui/Button';

const PAGE_SIZE = 10;

interface ServerOption {
	id: string;
	name: string;
}

interface ActivityLogTableProps {
	serverId?: string;
	servers?: ServerOption[];
}

function formatDate(iso: string): string {
	return new Date(iso).toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

function parseDetails(raw: string): string {
	try {
		const obj = JSON.parse(raw) as Record<string, unknown>;
		if (obj.file && Array.isArray(obj.changed_keys)) {
			return `Updated ${obj.file} — changed: ${(obj.changed_keys as string[]).join(', ')}`;
		}
		if (obj.service) {
			return `Service: ${obj.service}`;
		}
		if (obj.driver_count !== undefined && obj.race_count !== undefined) {
			return `${obj.driver_count} drivers, ${obj.race_count} races`;
		}
		return raw;
	} catch {
		return raw;
	}
}

const ACTION_BADGE: Record<ActionType, string> = {
	config_update: 'bg-blue-bg text-blue',
	server_start: 'bg-green-bg text-green',
	server_stop: 'bg-red-bg text-red',
	server_restart: 'bg-yellow-bg text-yellow',
	leaderboard_update: 'bg-overlay text-muted'
};

export function ActivityLogTable({ serverId, servers }: ActivityLogTableProps) {
	const [logs, setLogs] = useState<ActivityLog[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [filterAction, setFilterAction] = useState<ActionType | ''>('');
	const [filterServerId, setFilterServerId] = useState('');
	const [filterStartDate, setFilterStartDate] = useState('');
	const [filterEndDate, setFilterEndDate] = useState('');

	const [appliedFilter, setAppliedFilter] = useState<ActivityLogFilter>({});

	const fetchLogs = useCallback(
		async (currentPage: number, filter: ActivityLogFilter, reset: boolean) => {
			setIsLoading(true);
			setError(null);
			const params = { ...filter, page: currentPage, page_size: PAGE_SIZE };
			if (serverId) params.server_id = serverId;
			const result = await getActivityLogAction(params);
			setIsLoading(false);
			if (!result.success) {
				setError(result.message);
				return;
			}
			setHasMore(result.data.length === PAGE_SIZE);
			setLogs((prev) => (reset ? result.data : [...prev, ...result.data]));
		},
		[serverId]
	);

	useEffect(() => {
		fetchLogs(1, {}, true);
	}, [fetchLogs]);

	const applyFilters = () => {
		const filter: ActivityLogFilter = {};
		if (filterAction) filter.action = filterAction as ActionType;
		if (filterServerId) filter.server_id = filterServerId;
		if (filterStartDate) filter.start_date = new Date(filterStartDate).toISOString();
		if (filterEndDate) filter.end_date = new Date(filterEndDate).toISOString();
		setAppliedFilter(filter);
		setPage(1);
		setLogs([]);
		fetchLogs(1, filter, true);
	};

	const clearFilters = () => {
		setFilterAction('');
		setFilterServerId('');
		setFilterStartDate('');
		setFilterEndDate('');
		setAppliedFilter({});
		setPage(1);
		setLogs([]);
		fetchLogs(1, {}, true);
	};

	const loadMore = () => {
		const next = page + 1;
		setPage(next);
		fetchLogs(next, appliedFilter, false);
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="border-border bg-canvas flex flex-wrap items-end gap-3 rounded-lg border p-4">
				<div className="flex flex-col gap-1">
					<label className="text-subtle text-xs">Action type</label>
					<select
						value={filterAction}
						onChange={(e) => setFilterAction(e.target.value as ActionType | '')}
						className="form-input w-44 text-sm"
					>
						<option value="">All actions</option>
						{actionTypeSchema.options.map((opt) => (
							<option key={opt} value={opt}>
								{ACTION_TYPE_LABELS[opt]}
							</option>
						))}
					</select>
				</div>
				{servers && servers.length > 0 && (
					<div className="flex flex-col gap-1">
						<label className="text-subtle text-xs">Server</label>
						<select
							value={filterServerId}
							onChange={(e) => setFilterServerId(e.target.value)}
							className="form-input w-48 text-sm"
						>
							<option value="">All servers</option>
							{servers.map((s) => (
								<option key={s.id} value={s.id}>
									{s.name}
								</option>
							))}
						</select>
					</div>
				)}
				<div className="flex flex-col gap-1">
					<label className="text-subtle text-xs">From</label>
					<input
						type="date"
						value={filterStartDate}
						onChange={(e) => setFilterStartDate(e.target.value)}
						className="form-input w-36 text-sm"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-subtle text-xs">To</label>
					<input
						type="date"
						value={filterEndDate}
						onChange={(e) => setFilterEndDate(e.target.value)}
						className="form-input w-36 text-sm"
					/>
				</div>
				<Button variant="primary" size="sm" onClick={applyFilters}>
					Apply
				</Button>
				<Button variant="ghost" size="sm" onClick={clearFilters}>
					Clear
				</Button>
			</div>

			{error && <p className="text-red text-sm">{error}</p>}

			<div className="border-border bg-canvas overflow-hidden rounded-lg border">
				{logs.length === 0 && !isLoading ? (
					<div className="px-4 py-12 text-center">
						<div className="mb-3 text-4xl">📋</div>
						<p className="text-muted text-sm">No activity logged yet.</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full">
							<thead>
								<tr className="border-border-muted bg-base border-b">
									<th className="text-subtle px-4 py-2 text-left text-xs font-medium tracking-wider uppercase">
										Time
									</th>
									<th className="text-subtle px-4 py-2 text-left text-xs font-medium tracking-wider uppercase">
										User
									</th>
									{!serverId && (
										<th className="text-subtle px-4 py-2 text-left text-xs font-medium tracking-wider uppercase">
											Server
										</th>
									)}
									<th className="text-subtle px-4 py-2 text-left text-xs font-medium tracking-wider uppercase">
										Action
									</th>
									<th className="text-subtle px-4 py-2 text-left text-xs font-medium tracking-wider uppercase">
										Details
									</th>
								</tr>
							</thead>
							<tbody>
								{logs.map((log) => (
									<tr
										key={log.id}
										className="border-border-muted hover:bg-hover border-b transition-colors last:border-0"
									>
										<td className="text-muted px-4 py-3 text-sm whitespace-nowrap">
											{formatDate(log.createdAt)}
										</td>
										<td className="text-secondary px-4 py-3 text-sm">{log.username}</td>
										{!serverId && (
											<td className="text-secondary px-4 py-3 text-sm">
												{log.server?.name ?? log.serverId}
											</td>
										)}
										<td className="px-4 py-3">
											<span
												className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ACTION_BADGE[log.action] ?? 'bg-canvas text-muted'}`}
											>
												{ACTION_TYPE_LABELS[log.action] ?? log.action}
											</span>
										</td>
										<td className="text-muted px-4 py-3 text-sm">{parseDetails(log.details)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{isLoading && <div className="text-muted px-4 py-4 text-center text-sm">Loading…</div>}

				{hasMore && !isLoading && logs.length > 0 && (
					<div className="border-border-muted border-t px-4 py-3 text-center">
						<Button variant="ghost" size="sm" onClick={loadMore}>
							Load more
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
