'use client';

import { PointsEntry } from '@/lib/schemas/leaderboard';

interface PointsTableEditorProps {
	pointsTable: PointsEntry[];
	onChange: (pointsTable: PointsEntry[]) => void;
}

export function PointsTableEditor({ pointsTable, onChange }: PointsTableEditorProps) {
	const update = (index: number, patch: Partial<PointsEntry>) => {
		onChange(pointsTable.map((e, i) => (i === index ? { ...e, ...patch } : e)));
	};

	const remove = (index: number) => {
		onChange(pointsTable.filter((_, i) => i !== index));
	};

	const add = () => {
		const pos = pointsTable.length + 1;
		onChange([
			...pointsTable,
			{ id: crypto.randomUUID(), points: 0, label: `P${pos}`, color: '#374151', textColor: '#ffffff', priority: pos }
		]);
	};

	return (
		<div className="space-y-3">
			{pointsTable.map((entry, i) => (
				<div key={i} className="flex items-center gap-3 rounded-lg bg-gray-700 p-3">
					<div className="flex flex-1 flex-wrap gap-3">
						<div className="flex flex-col gap-1">
							<label className="text-xs text-gray-400">Label</label>
							<input
								type="text"
								value={entry.label}
								onChange={(e) => update(i, { label: e.target.value })}
								className="w-20 rounded bg-gray-600 px-2 py-1 text-sm text-white"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-xs text-gray-400">Points</label>
							<input
								type="number"
								min={0}
								value={entry.points}
								onChange={(e) => update(i, { points: parseInt(e.target.value) || 0 })}
								className="w-20 rounded bg-gray-600 px-2 py-1 text-sm text-white"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-xs text-gray-400">Priority</label>
							<input
								type="number"
								min={0}
								value={entry.priority}
								onChange={(e) => update(i, { priority: parseInt(e.target.value) || 0 })}
								className="w-20 rounded bg-gray-600 px-2 py-1 text-sm text-white"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-xs text-gray-400">Bg Color</label>
							<div className="flex items-center gap-2">
								<input
									type="color"
									value={entry.color}
									onChange={(e) => update(i, { color: e.target.value })}
									className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
								/>
								<input
									type="text"
									value={entry.color}
									onChange={(e) => {
										if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) update(i, { color: e.target.value });
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
									value={entry.textColor}
									onChange={(e) => update(i, { textColor: e.target.value })}
									className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
								/>
								<input
									type="text"
									value={entry.textColor}
									onChange={(e) => {
										if (/^#[0-9a-fA-F]{6}$/.test(e.target.value))
											update(i, { textColor: e.target.value });
									}}
									className="w-24 rounded bg-gray-600 px-2 py-1 font-mono text-sm text-white"
								/>
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-xs text-gray-400">Preview</label>
							<span
								className="rounded px-2 py-1 text-sm font-semibold"
								style={{ backgroundColor: entry.color, color: entry.textColor }}
							>
								{entry.label}
							</span>
						</div>
					</div>

					<button
						onClick={() => remove(i)}
						className="rounded px-2 py-1 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300"
						title="Remove entry"
					>
						✕
					</button>
				</div>
			))}

			<button
				onClick={add}
				className="w-full rounded-lg border border-dashed border-gray-600 py-2 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-300"
			>
				+ Add Position
			</button>
		</div>
	);
}
