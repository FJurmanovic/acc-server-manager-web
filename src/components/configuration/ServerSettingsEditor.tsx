'use client';

import type { ServerSettings } from '@/lib/schemas/config';
import { FIELD_LABELS } from '@/lib/schemas/config';

interface ServerSettingsEditorProps {
	formData: ServerSettings;
	disabled?: boolean;
	onFormDataChange: (data: ServerSettings) => void;
}

const textFields: { key: keyof ServerSettings; type: 'text' | 'password' }[] = [
	{ key: 'serverName', type: 'text' },
	{ key: 'adminPassword', type: 'password' },
	{ key: 'password', type: 'password' },
	{ key: 'spectatorPassword', type: 'password' },
	{ key: 'centralEntryListPath', type: 'text' }
];

const carGroups = ['FreeForAll', 'GT3', 'GT4', 'GT2', 'GTC', 'TCX'];

const numberFields: { key: keyof ServerSettings; min: number; max: number }[] = [
	{ key: 'trackMedalsRequirement', min: 0, max: 3 },
	{ key: 'safetyRatingRequirement', min: -1, max: 99 },
	{ key: 'racecraftRatingRequirement', min: -1, max: 99 },
	{ key: 'maxCarSlots', min: 1, max: 30 }
];

const selectFields: { key: keyof ServerSettings }[] = [
	{ key: 'dumpLeaderboards' },
	{ key: 'isRaceLocked' },
	{ key: 'randomizeTrackWhenEmpty' },
	{ key: 'allowAutoDQ' },
	{ key: 'shortFormationLap' },
	{ key: 'dumpEntryList' },
	{ key: 'ignorePrematureDisconnects' }
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
					{textFields.map(({ key, type }) => (
						<div key={key}>
							<label className="mb-1.5 block text-sm font-medium text-secondary">{FIELD_LABELS[key]}</label>
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
						<label className="mb-1.5 block text-sm font-medium text-secondary">{FIELD_LABELS.carGroup}</label>
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
					{numberFields.map(({ key, min, max }) => (
						<div key={key}>
							<label className="mb-1.5 block text-sm font-medium text-secondary">{FIELD_LABELS[key]}</label>
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
					{selectFields.map(({ key }) => (
						<div key={key}>
							<label className="mb-1.5 block text-sm font-medium text-secondary">{FIELD_LABELS[key]}</label>
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
						<label className="mb-1.5 block text-sm font-medium text-secondary">{FIELD_LABELS.formationLapType}</label>
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
