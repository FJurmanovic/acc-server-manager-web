'use client';

import { FlPoints } from '@/lib/schemas/leaderboard';

interface FlPointsEditorProps {
	flPoints: FlPoints;
	onChange: (flPoints: FlPoints) => void;
}

export function FlPointsEditor({ flPoints, onChange }: FlPointsEditorProps) {
	const update = (patch: Partial<FlPoints>) => onChange({ ...flPoints, ...patch });

	return (
		<div className="rounded-lg bg-gray-700 p-4">
			<p className="mb-4 text-sm text-gray-400">
				Points awarded to the driver who sets the fastest lap in each race.
			</p>
			<div className="flex flex-wrap gap-4">
				<div className="flex flex-col gap-1">
					<label className="text-xs text-gray-400">Label</label>
					<input
						type="text"
						value={flPoints.label}
						onChange={(e) => update({ label: e.target.value })}
						className="w-24 rounded bg-gray-600 px-2 py-1 text-sm text-white"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-xs text-gray-400">Points</label>
					<input
						type="number"
						min={0}
						value={flPoints.points}
						onChange={(e) => update({ points: parseInt(e.target.value) || 0 })}
						className="w-20 rounded bg-gray-600 px-2 py-1 text-sm text-white"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-xs text-gray-400">Priority</label>
					<input
						type="number"
						min={0}
						value={flPoints.priority}
						onChange={(e) => update({ priority: parseInt(e.target.value) || 0 })}
						className="w-20 rounded bg-gray-600 px-2 py-1 text-sm text-white"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-xs text-gray-400">Bg Color</label>
					<div className="flex items-center gap-2">
						<input
							type="color"
							value={flPoints.color}
							onChange={(e) => update({ color: e.target.value })}
							className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
						/>
						<input
							type="text"
							value={flPoints.color}
							onChange={(e) => {
								if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) update({ color: e.target.value });
							}}
							className="w-24 rounded bg-gray-600 px-2 py-1 font-mono text-sm text-white"
						/>
					</div>
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-xs text-gray-400">Text Color</label>
					<div className="flex items-center gap-2">
						<input
							type="color"
							value={flPoints.textColor}
							onChange={(e) => update({ textColor: e.target.value })}
							className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
						/>
						<input
							type="text"
							value={flPoints.textColor}
							onChange={(e) => {
								if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) update({ textColor: e.target.value });
							}}
							className="w-24 rounded bg-gray-600 px-2 py-1 font-mono text-sm text-white"
						/>
					</div>
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-xs text-gray-400">Preview</label>
					<span
						className="rounded px-2 py-1 text-sm font-semibold"
						style={{ backgroundColor: flPoints.color, color: flPoints.textColor }}
					>
						{flPoints.label}
					</span>
				</div>
			</div>
		</div>
	);
}
