'use client';

import type { EventRules } from '@/lib/schemas/config';
import { FIELD_LABELS } from '@/lib/schemas/config';

interface EventRulesEditorProps {
	formData: EventRules;
	disabled?: boolean;
	onFormDataChange: (data: EventRules) => void;
}

const numberFields: { key: keyof EventRules; min: number; max?: number }[] = [
	{ key: 'pitWindowLengthSec', min: -1 },
	{ key: 'driverStintTimeSec', min: -1 },
	{ key: 'mandatoryPitstopCount', min: 0, max: 5 },
	{ key: 'maxTotalDrivingTime', min: -1 },
	{ key: 'maxDriversCount', min: 1, max: 10 },
	{ key: 'tyreSetCount', min: 0, max: 50 }
];

const booleanFields: { key: keyof EventRules }[] = [
	{ key: 'isRefuellingAllowedInRace' },
	{ key: 'isRefuellingTimeFixed' },
	{ key: 'isMandatoryPitstopRefuellingRequired' },
	{ key: 'isMandatoryPitstopTyreChangeRequired' },
	{ key: 'isMandatoryPitstopSwapDriverRequired' }
];

export function EventRulesEditor({ formData, disabled, onFormDataChange }: EventRulesEditorProps) {
	const handleInputChange = (key: keyof EventRules, value: number) => {
		onFormDataChange({ ...formData, [key]: value });
	};

	return (
		<div className="max-w-4xl space-y-8">
			<div className="space-y-6">
				<h3 className="border-b border-border-muted pb-2 text-sm font-semibold text-primary">Race Rules</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label className="mb-1.5 block text-sm font-medium text-secondary">{FIELD_LABELS.qualifyStandingType}</label>
						<select
							disabled={disabled}
							value={formData.qualifyStandingType}
							onChange={(e) => handleInputChange('qualifyStandingType', parseInt(e.target.value))}
							className="form-select w-full"
						>
							<option value={1}>Fastest Lap</option>
							<option value={2}>Average Lap</option>
						</select>
					</div>
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
					Pitstop & Refuelling Rules
				</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{booleanFields.map(({ key }) => (
						<div key={key}>
							<label className="mb-1.5 block text-sm font-medium text-secondary">{FIELD_LABELS[key]}</label>
							<select
								disabled={disabled}
								value={formData[key] ? 'true' : 'false'}
								onChange={(e) => handleInputChange(key, e.target.value === 'true' ? 1 : 0)}
								className="form-select w-full"
							>
								<option value="false">No</option>
								<option value="true">Yes</option>
							</select>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
