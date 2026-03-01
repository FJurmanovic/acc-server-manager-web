'use client';

import { useState } from 'react';
import { Leaderboard, LeaderboardDriver } from '@/lib/schemas/leaderboard';
import { saveLeaderboardAction } from '@/lib/actions/leaderboard';
import { LeaderboardStandings } from './LeaderboardStandings';
import { DriversEditor } from './editors/DriversEditor';
import { PointsTableEditor } from './editors/PointsTableEditor';
import { FlPointsEditor } from './editors/FlPointsEditor';
import { TracksEditor } from './editors/TracksEditor';

type Section = 'standings' | 'drivers' | 'points' | 'fl' | 'tracks';

const sections: { id: Section; label: string }[] = [
	{ id: 'standings', label: 'Standings' },
	{ id: 'drivers', label: 'Drivers' },
	{ id: 'points', label: 'Points Table' },
	{ id: 'fl', label: 'FL Points' },
	{ id: 'tracks', label: 'Tracks' }
];

interface LeaderboardManagerProps {
	serverId: string;
	initialData: Leaderboard;
}

function isDirty(a: Leaderboard, b: Leaderboard) {
	return JSON.stringify(a) !== JSON.stringify(b);
}

export function LeaderboardManager({ serverId, initialData }: LeaderboardManagerProps) {
	const [draft, setDraft] = useState<Leaderboard>(initialData);
	const [saved, setSaved] = useState<Leaderboard>(initialData);
	const [activeSection, setActiveSection] = useState<Section>('standings');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const dirty = isDirty(draft, saved);

	const handleDriversChange = (newDrivers: LeaderboardDriver[]) => {
		const oldDriverIds = new Set(draft.drivers.map((d) => d.id));

		// Remap tracks: keep results for drivers that still exist, remove results for deleted drivers
		const newTracks = draft.tracks.map((t) => ({
			...t,
			// Filter existing results to only include drivers still in newDrivers, add DNS for new drivers
			results: [
				// Keep existing results for drivers still in the list
				...t.results.filter((r) => newDrivers.some((d) => d.id === r.driverId)),
				// Add DNS for new drivers
				...newDrivers
					.filter((d) => !oldDriverIds.has(d.id))
					.map((d) => ({ driverId: d.id, score: 'DNS' as const }))
			]
		}));

		setDraft({ ...draft, drivers: newDrivers, tracks: newTracks });
	};

	const handleSave = async () => {
		setIsSubmitting(true);
		setError(null);
		try {
			const result = await saveLeaderboardAction(serverId, draft);
			if (result.success) {
				setSaved(draft);
			} else {
				setError(result.message ?? 'Unknown error');
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Failed to save');
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderSection = () => {
		switch (activeSection) {
			case 'standings':
				return <LeaderboardStandings leaderboard={draft} />;
			case 'drivers':
				return <DriversEditor drivers={draft.drivers} onChange={handleDriversChange} />;
			case 'points':
				return (
					<PointsTableEditor
						pointsTable={draft.pointsTable}
						onChange={(pointsTable) => setDraft({ ...draft, pointsTable })}
					/>
				);
			case 'fl':
				return (
					<FlPointsEditor
						flPoints={draft.flPoints}
						onChange={(flPoints) => setDraft({ ...draft, flPoints })}
					/>
				);
			case 'tracks':
				return (
					<TracksEditor
						tracks={draft.tracks}
						drivers={draft.drivers}
						pointsTable={draft.pointsTable}
						onChange={(tracks) => setDraft({ ...draft, tracks })}
					/>
				);
		}
	};

	return (
		<div className="space-y-4">
			{dirty && (
				<div className="flex items-center justify-between rounded-lg bg-yellow-900/40 px-4 py-2 text-sm text-yellow-300">
					<span>Unsaved changes</span>
					<div className="flex gap-2">
						<button
							onClick={() => setDraft(saved)}
							className="rounded px-2 py-1 text-xs text-yellow-400 hover:text-yellow-200"
						>
							Discard
						</button>
						<button
							onClick={handleSave}
							disabled={isSubmitting}
							className="rounded bg-yellow-600 px-3 py-1 text-xs font-semibold text-white hover:bg-yellow-500 disabled:opacity-50"
						>
							{isSubmitting ? 'Saving…' : 'Save'}
						</button>
					</div>
				</div>
			)}

			{error && (
				<div className="rounded-lg bg-red-900/40 px-4 py-2 text-sm text-red-300">{error}</div>
			)}

			<div className="flex flex-wrap gap-2">
				{sections.map((s) => (
					<button
						key={s.id}
						onClick={() => setActiveSection(s.id)}
						className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
							activeSection === s.id
								? 'bg-blue-600 text-white'
								: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
						}`}
					>
						{s.label}
					</button>
				))}
			</div>

			<div>{renderSection()}</div>

			{!dirty && (
				<div className="flex justify-end">
					<button
						onClick={handleSave}
						disabled={isSubmitting}
						className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
					>
						{isSubmitting ? 'Saving…' : 'Save Leaderboard'}
					</button>
				</div>
			)}
		</div>
	);
}
