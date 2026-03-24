'use client';

import type { ServerSettings } from '@/lib/schemas/config';

interface ServerSettingsEditorProps {
	formData: ServerSettings;
	disabled?: boolean;
	onFormDataChange: (data: ServerSettings) => void;
}

const textFields = [
	{
		key: 'serverName' as keyof ServerSettings,
		label: 'Server Name',
		type: 'text'
	},
	{
		key: 'adminPassword' as keyof ServerSettings,
		label: 'Admin Password',
		type: 'password'
	},
	{
		key: 'password' as keyof ServerSettings,
		label: 'Password',
		type: 'password'
	},
	{
		key: 'spectatorPassword' as keyof ServerSettings,
		label: 'Spectator Password',
		type: 'password'
	},
	{
		key: 'centralEntryListPath' as keyof ServerSettings,
		label: 'Central Entry List Path',
		type: 'text'
	}
];

const carGroups = ['FreeForAll', 'GT3', 'GT4', 'GT2', 'GTC', 'TCX'];

const numberFields = [
	{
		key: 'trackMedalsRequirement' as keyof ServerSettings,
		label: 'Track Medals Requirement',
		min: 0,
		max: 3
	},
	{
		key: 'safetyRatingRequirement' as keyof ServerSettings,
		label: 'Safety Rating Requirement',
		min: -1,
		max: 99
	},
	{
		key: 'racecraftRatingRequirement' as keyof ServerSettings,
		label: 'Racecraft Rating Requirement',
		min: -1,
		max: 99
	},
	{
		key: 'maxCarSlots' as keyof ServerSettings,
		label: 'Max Car Slots',
		min: 1,
		max: 30
	}
];

const selectFields = [
	{
		key: 'dumpLeaderboards' as keyof ServerSettings,
		label: 'Dump Leaderboards'
	},
	{ key: 'isRaceLocked' as keyof ServerSettings, label: 'Race Locked' },
	{
		key: 'randomizeTrackWhenEmpty' as keyof ServerSettings,
		label: 'Randomize Track When Empty'
	},
	{ key: 'allowAutoDQ' as keyof ServerSettings, label: 'Allow Auto DQ' },
	{
		key: 'shortFormationLap' as keyof ServerSettings,
		label: 'Short Formation Lap'
	},
	{
		key: 'dumpEntryList' as keyof ServerSettings,
		label: 'Dump Entry List'
	},
	{
		key: 'ignorePrematureDisconnects' as keyof ServerSettings,
		label: 'Ignore Premature Disconnects'
	}
];

export function ServerSettingsEditor({ formData, disabled, onFormDataChange }: ServerSettingsEditorProps) {
	const handleInputChange = (key: keyof ServerSettings, value: string | number) => {
		onFormDataChange({ ...formData, [key]: value });
	};

	return (
		<div className="max-w-4xl space-y-8">
			<div className="space-y-6">
				<h3 className="border-b border-border-muted pb-2 text-sm font-semibold text-primary">
					Basic Settings
				</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{textFields.map(({ key, label, type }) => (
						<div key={key}>
							<label className="mb-1.5 block text-sm font-medium text-secondary">{label}</label>
							<input
								type={type}
								disabled={disabled}
								value={formData[key] as string}
								onChange={(e) => handleInputChange(key, e.target.value)}
								className="form-input w-full"
							/>
						</div>
					))}

					<div>
						<label className="mb-1.5 block text-sm font-medium text-secondary">Car Group</label>
						<select
							disabled={disabled}
							value={formData.carGroup}
							onChange={(e) => handleInputChange('carGroup', e.target.value)}
							className="form-select w-full"
						>
							{carGroups.map((group) => (
								<option key={group} value={group}>
									{group}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			<div className="space-y-6">
				<h3 className="border-b border-border-muted pb-2 text-sm font-semibold text-primary">
					Requirements & Limits
				</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{numberFields.map(({ key, label, min, max }) => (
						<div key={key}>
							<label className="mb-1.5 block text-sm font-medium text-secondary">{label}</label>
							<input
								type="number"
								disabled={disabled}
								value={formData[key] as number}
								onChange={(e) => handleInputChange(key, parseInt(e.target.value) || 0)}
								className="form-input w-full"
								min={min}
								max={max}
							/>
						</div>
					))}
				</div>
			</div>

			<div className="space-y-6">
				<h3 className="border-b border-border-muted pb-2 text-sm font-semibold text-primary">
					Race Options
				</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{selectFields.map(({ key, label }) => (
						<div key={key}>
							<label className="mb-1.5 block text-sm font-medium text-secondary">{label}</label>
							<select
								disabled={disabled}
								value={formData[key] as number}
								onChange={(e) => handleInputChange(key, parseInt(e.target.value))}
								className="form-select w-full"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					))}

					<div>
						<label className="mb-1.5 block text-sm font-medium text-secondary">
							Formation Lap Type
						</label>
						<select
							disabled={disabled}
							value={formData.formationLapType}
							onChange={(e) => handleInputChange('formationLapType', parseInt(e.target.value))}
							className="form-select w-full"
						>
							<option value={0}>Old Limiter Lap</option>
							<option value={1}>
								Free (replaces /manual start), only usable for private servers
							</option>
							<option value={3}>Default formation lap with position control and UI</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	);
}
