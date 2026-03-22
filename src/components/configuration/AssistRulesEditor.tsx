'use client';

import type { AssistRules } from '@/lib/schemas/config';

interface AssistRulesEditorProps {
	formData: AssistRules;
	disabled?: boolean;
	onFormDataChange: (data: AssistRules) => void;
}

const assistFields = [
	{
		key: 'stabilityControlLevelMax' as keyof AssistRules,
		label: 'Stability Control Level Max',
		type: 'number'
	},
	{
		key: 'disableAutosteer' as keyof AssistRules,
		label: 'Disable Autosteer',
		type: 'select'
	},
	{
		key: 'disableAutoLights' as keyof AssistRules,
		label: 'Disable Auto Lights',
		type: 'select'
	},
	{
		key: 'disableAutoWiper' as keyof AssistRules,
		label: 'Disable Auto Wiper',
		type: 'select'
	},
	{
		key: 'disableAutoEngineStart' as keyof AssistRules,
		label: 'Disable Auto Engine Start',
		type: 'select'
	},
	{
		key: 'disableAutoPitLimiter' as keyof AssistRules,
		label: 'Disable Auto Pit Limiter',
		type: 'select'
	},
	{
		key: 'disableAutoGear' as keyof AssistRules,
		label: 'Disable Auto Gear',
		type: 'select'
	},
	{
		key: 'disableAutoClutch' as keyof AssistRules,
		label: 'Disable Auto Clutch',
		type: 'select'
	},
	{
		key: 'disableIdealLine' as keyof AssistRules,
		label: 'Disable Ideal Line',
		type: 'select'
	}
];

export function AssistRulesEditor({ formData, disabled, onFormDataChange }: AssistRulesEditorProps) {
	const handleInputChange = (key: keyof AssistRules, value: string | number) => {
		onFormDataChange({
			...formData,
			[key]: typeof value === 'string' ? parseInt(value) : value
		});
	};

	return (
		<div className="max-w-3xl space-y-6">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{assistFields.map(({ key, label, type }) => (
					<div key={key}>
						<label className="mb-1.5 block text-sm font-medium text-secondary">{label}</label>
						{type === 'number' ? (
							<input
								type="number"
								disabled={disabled}
								value={formData[key]}
								onChange={(e) => handleInputChange(key, e.target.value)}
								className="form-input w-full"
								min="0"
								max="5"
							/>
						) : (
							<select
								disabled={disabled}
								value={formData[key]}
								onChange={(e) => handleInputChange(key, e.target.value)}
								className="form-select w-full"
							>
								<option value={0}>Allowed</option>
								<option value={1}>Disabled</option>
							</select>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
