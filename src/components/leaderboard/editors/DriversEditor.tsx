'use client';

import { LeaderboardDriver } from '@/lib/schemas/leaderboard';

function randomColor(): string {
	return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
}

interface DriversEditorProps {
	drivers: LeaderboardDriver[];
	onChange: (drivers: LeaderboardDriver[]) => void;
}

export function DriversEditor({ drivers, onChange }: DriversEditorProps) {
	const update = (index: number, patch: Partial<LeaderboardDriver>) => {
		const next = drivers.map((d, i) => (i === index ? { ...d, ...patch } : d));
		onChange(next);
	};

	const moveUp = (index: number) => {
		if (index === 0) return;
		const next = [...drivers];
		[next[index - 1], next[index]] = [next[index], next[index - 1]];
		onChange(next);
	};

	const moveDown = (index: number) => {
		if (index === drivers.length - 1) return;
		const next = [...drivers];
		[next[index], next[index + 1]] = [next[index + 1], next[index]];
		onChange(next);
	};

	const remove = (index: number) => {
		onChange(drivers.filter((_, i) => i !== index));
	};

	const add = () => {
		onChange([...drivers, { id: crypto.randomUUID(), name: 'New Driver', initials: 'ND', color: randomColor() }]);
	};

	return (
		<div className="space-y-3">
			{drivers.map((driver, i) => (
				<div key={driver.id} className="flex items-center gap-3 rounded-lg bg-gray-700 p-3">
					<div className="flex flex-col gap-1">
						<button
							onClick={() => moveUp(i)}
							disabled={i === 0}
							className="rounded px-1 py-0.5 text-xs text-gray-400 hover:text-white disabled:opacity-30"
							title="Move up"
						>
							▲
						</button>
						<button
							onClick={() => moveDown(i)}
							disabled={i === drivers.length - 1}
							className="rounded px-1 py-0.5 text-xs text-gray-400 hover:text-white disabled:opacity-30"
							title="Move down"
						>
							▼
						</button>
					</div>

					<div className="flex flex-1 flex-wrap gap-3">
						<div className="flex flex-col gap-1">
							<label className="text-xs text-gray-400">Name</label>
							<input
								type="text"
								value={driver.name}
								onChange={(e) => update(i, { name: e.target.value })}
								className="rounded bg-gray-600 px-2 py-1 text-sm text-white"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-xs text-gray-400">Initials</label>
							<input
								type="text"
								value={driver.initials}
								maxLength={10}
								onChange={(e) => update(i, { initials: e.target.value })}
								className="w-24 rounded bg-gray-600 px-2 py-1 text-sm text-white"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-xs text-gray-400">Color</label>
							<div className="flex items-center gap-2">
								<input
									type="color"
									value={driver.color}
									onChange={(e) => update(i, { color: e.target.value })}
									className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
								/>
								<input
									type="text"
									value={driver.color}
									onChange={(e) => {
										if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
											update(i, { color: e.target.value });
										}
									}}
									className="w-24 rounded bg-gray-600 px-2 py-1 font-mono text-sm text-white"
								/>
							</div>
						</div>
					</div>

					<button
						onClick={() => remove(i)}
						className="rounded px-2 py-1 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300"
						title="Remove driver"
					>
						✕
					</button>
				</div>
			))}

			<button
				onClick={add}
				className="w-full rounded-lg border border-dashed border-gray-600 py-2 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-300"
			>
				+ Add Driver
			</button>
		</div>
	);
}
