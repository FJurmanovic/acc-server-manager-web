'use client';

import { useState } from 'react';
import { GhButton } from '@/components/ui/GhButton';
import { Leaderboard, LeaderboardDriver, FlPoints } from '@/lib/schemas/leaderboard';
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

// Extended type for internal UI state with full FL Points object
type LeaderboardDraft = Leaderboard & { flPointsData: FlPoints };

function toApiFormat(draft: LeaderboardDraft): Leaderboard {
	return {
		...draft,
		flPoints: draft.flPointsData.points,
		flColor: draft.flPointsData.color,
		flTextColor: draft.flPointsData.textColor
	};
}

function toUiFormat(api: Leaderboard): LeaderboardDraft {
	return {
		...api,
		flPointsData: {
			points: api.flPoints,
			label: 'FL +' + api.flPoints,
			color: api.flColor,
			textColor: api.flTextColor,
			priority: 3
		}
	};
}

function isDirty(a: LeaderboardDraft, b: LeaderboardDraft) {
	return JSON.stringify(a) !== JSON.stringify(b);
}

export function LeaderboardManager({ serverId, initialData }: LeaderboardManagerProps) {
	const [draft, setDraft] = useState<LeaderboardDraft>(toUiFormat(initialData));
	const [saved, setSaved] = useState<LeaderboardDraft>(toUiFormat(initialData));
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
			const apiData = toApiFormat(draft);
			const result = await saveLeaderboardAction(serverId, apiData);
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
				return <LeaderboardStandings leaderboard={toApiFormat(draft)} />;
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
						flPoints={draft.flPointsData}
						onChange={(flPointsData) => setDraft({ ...draft, flPointsData })}
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
				<div className="flex items-center justify-between rounded-lg border border-gh-yellow/30 bg-gh-yellow-bg px-4 py-2 text-sm text-gh-yellow">
					<span>Unsaved changes</span>
					<div className="flex gap-2">
						<button
							onClick={() => setDraft(saved)}
							className="rounded px-2 py-1 text-xs text-gh-yellow hover:text-gh-primary"
						>
							Discard
						</button>
						<button
							onClick={handleSave}
							disabled={isSubmitting}
							className="rounded bg-gh-yellow px-3 py-1 text-xs font-semibold text-gh-base hover:opacity-90 disabled:opacity-40"
						>
							{isSubmitting ? 'Saving…' : 'Save'}
						</button>
					</div>
				</div>
			)}

			{error && (
				<div className="rounded-lg border border-gh-red/30 bg-gh-red-bg px-4 py-2 text-sm text-gh-red">
					{error}
				</div>
			)}

			<div className="flex flex-wrap gap-2">
				{sections.map((s) => (
					<button
						key={s.id}
						onClick={() => setActiveSection(s.id)}
						className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
							activeSection === s.id
								? 'bg-gh-blue text-white'
								: 'bg-gh-overlay text-gh-secondary hover:bg-gh-border'
						}`}
					>
						{s.label}
					</button>
				))}
			</div>

			<div>{renderSection()}</div>

			{!dirty && (
				<div className="flex justify-end">
					<GhButton variant="primary" size="md" onClick={handleSave} disabled={isSubmitting}>
						{isSubmitting ? 'Saving…' : 'Save Leaderboard'}
					</GhButton>
				</div>
			)}
		</div>
	);
}
