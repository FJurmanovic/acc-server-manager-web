'use client';

import type { EventRules } from '@/lib/schemas/config';

interface EventRulesEditorProps {
	formData: EventRules;
	disabled?: boolean;
	onFormDataChange: (data: EventRules) => void;
}

const numberFields = [
	{
		key: 'qualifyStandingType' as keyof EventRules,
		label: 'Qualify Standing Type',
		min: -1,
		max: 1
	},
	{
		key: 'pitWindowLengthSec' as keyof EventRules,
		label: 'Pit Window Length (seconds)',
		min: -1
	},
	{
		key: 'driverStintTimeSec' as keyof EventRules,
		label: 'Driver Stint Time (seconds)',
		min: -1
	},
	{
		key: 'mandatoryPitstopCount' as keyof EventRules,
		label: 'Mandatory Pitstop Count',
		min: -1,
		max: 5
	},
	{
		key: 'maxTotalDrivingTime' as keyof EventRules,
		label: 'Max Total Driving Time (seconds)',
		min: -1
	},
	{
		key: 'maxDriversCount' as keyof EventRules,
		label: 'Max Drivers Count',
		min: 1,
		max: 10
	},
	{
		key: 'tyreSetCount' as keyof EventRules,
		label: 'Tyre Set Count',
		min: 0,
		max: 50
	}
];

const booleanFields = [
	{
		key: 'isRefuellingAllowedInRace' as keyof EventRules,
		label: 'Refuelling Allowed in Race'
	},
	{
		key: 'isRefuellingTimeFixed' as keyof EventRules,
		label: 'Refuelling Time Fixed'
	},
	{
		key: 'isMandatoryPitstopRefuellingRequired' as keyof EventRules,
		label: 'Mandatory Pitstop Refuelling Required'
	},
	{
		key: 'isMandatoryPitstopTyreChangeRequired' as keyof EventRules,
		label: 'Mandatory Pitstop Tyre Change Required'
	},
	{
		key: 'isMandatoryPitstopSwapDriverRequired' as keyof EventRules,
		label: 'Mandatory Pitstop Swap Driver Required'
	}
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
					Pitstop & Refuelling Rules
				</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{booleanFields.map(({ key, label }) => (
						<div key={key}>
							<label className="mb-1.5 block text-sm font-medium text-secondary">{label}</label>
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
