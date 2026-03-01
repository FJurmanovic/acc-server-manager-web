'use client';

import { LeaderboardDriver, LeaderboardTrack, PointsEntry, ResultValue } from '@/lib/schemas/leaderboard';

interface ResultInputProps {
	value: ResultValue;
	pointsTable: PointsEntry[];
	onChange: (value: ResultValue) => void;
}

function ResultInput({ value, pointsTable, onChange }: ResultInputProps) {
	const knownPoints = Array.from(new Set(pointsTable.map((e) => e.points))).sort((a, b) => b - a);
	// Fallback 0 to DNS if 0 is not a valid points option
	const displayValue = value === 0 && !knownPoints.includes(0) ? 'DNS' : value;
	// Ensure the current numeric value is always included in options
	const allPoints = typeof displayValue === 'number'
		? Array.from(new Set([...knownPoints, displayValue])).sort((a, b) => b - a)
		: knownPoints;

	const handleChange = (raw: string) => {
		if (raw === 'DNF') return onChange('DNF');
		if (raw === 'DNS') return onChange('DNS');
		const parsed = parseInt(raw);
		onChange(isNaN(parsed) ? 0 : parsed);
	};

	return (
		<select
			value={String(displayValue)}
			onChange={(e) => handleChange(e.target.value)}
			className="w-full rounded bg-gray-600 px-1 py-1 text-xs text-white"
		>
			{allPoints.map((p) => (
				<option key={p} value={String(p)}>
					{p}
				</option>
			))}
			<option value="DNF">DNF</option>
			<option value="DNS">DNS</option>
		</select>
	);
}

interface TracksEditorProps {
	tracks: LeaderboardTrack[];
	drivers: LeaderboardDriver[];
	pointsTable: PointsEntry[];
	onChange: (tracks: LeaderboardTrack[]) => void;
}

export function TracksEditor({ tracks, drivers, pointsTable, onChange }: TracksEditorProps) {
	const updateTrack = (index: number, patch: Partial<LeaderboardTrack>) => {
		onChange(tracks.map((t, i) => (i === index ? { ...t, ...patch } : t)));
	};

	const updateResult = (trackIndex: number, driverIndex: number, value: ResultValue) => {
		const newResults = [...tracks[trackIndex].results];
		newResults[driverIndex] = value;
		updateTrack(trackIndex, { results: newResults });
	};

	const removeTrack = (index: number) => {
		onChange(tracks.filter((_, i) => i !== index));
	};

	const addTrack = () => {
		onChange([
			...tracks,
			{
				name: `Race ${tracks.length + 1}`,
				results: drivers.map(() => 'DNS' as const),
				fastestLapInitials: ''
			}
		]);
	};

	return (
		<div className="space-y-4">
			{tracks.map((track, ti) => (
				<div key={ti} className="rounded-lg bg-gray-700 p-4">
					<div className="mb-3 flex items-center gap-3">
						<input
							type="text"
							value={track.name}
							onChange={(e) => updateTrack(ti, { name: e.target.value })}
							className="flex-1 rounded bg-gray-600 px-2 py-1 text-sm font-semibold text-white"
							placeholder="Track name"
						/>
						<div className="flex items-center gap-2">
							<label className="text-xs text-gray-400">FL Driver:</label>
							<select
								value={track.fastestLapInitials}
								onChange={(e) => updateTrack(ti, { fastestLapInitials: e.target.value })}
								className="rounded bg-gray-600 px-2 py-1 text-sm text-white"
							>
								<option value="">—</option>
								{drivers.map((d) => (
									<option key={d.initials} value={d.initials}>
										{d.initials} ({d.name})
									</option>
								))}
							</select>
						</div>
						<button
							onClick={() => removeTrack(ti)}
							className="rounded px-2 py-1 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300"
							title="Remove track"
						>
							✕
						</button>
					</div>

					{drivers.length === 0 ? (
						<p className="text-xs text-gray-500">Add drivers first to enter results.</p>
					) : (
						<div className="space-y-1">
							{drivers.map((driver, di) => (
								<div key={di} className="flex items-center gap-3">
									<div className="flex w-40 items-center gap-2">
										<div
											className="h-3 w-3 shrink-0 rounded-full"
											style={{ backgroundColor: driver.color }}
										/>
										<span className="truncate text-sm text-gray-300">{driver.name}</span>
									</div>
									<div className="w-24">
										<ResultInput
											value={track.results[di] ?? 0}
											pointsTable={pointsTable}
											onChange={(v) => updateResult(ti, di, v)}
										/>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			))}

			<button
				onClick={addTrack}
				className="w-full rounded-lg border border-dashed border-gray-600 py-2 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-300"
			>
				+ Add Track / Race
			</button>
		</div>
	);
}
