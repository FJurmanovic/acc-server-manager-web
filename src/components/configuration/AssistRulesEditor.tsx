'use client';

import type { AssistRules } from '@/lib/schemas/config';
import { FIELD_LABELS } from '@/lib/schemas/config';

interface AssistRulesEditorProps {
	formData: AssistRules;
	disabled?: boolean;
	onFormDataChange: (data: AssistRules) => void;
}

const assistFields: { key: keyof AssistRules; type: 'number' | 'select' }[] = [
	{ key: 'stabilityControlLevelMax', type: 'number' },
	{ key: 'disableAutosteer', type: 'select' },
	{ key: 'disableAutoLights', type: 'select' },
	{ key: 'disableAutoWiper', type: 'select' },
	{ key: 'disableAutoEngineStart', type: 'select' },
	{ key: 'disableAutoPitLimiter', type: 'select' },
	{ key: 'disableAutoGear', type: 'select' },
	{ key: 'disableAutoClutch', type: 'select' },
	{ key: 'disableIdealLine', type: 'select' }
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
				{assistFields.map(({ key, type }) => (
					<div key={key}>
						<label className="mb-1.5 block text-sm font-medium text-secondary">{FIELD_LABELS[key]}</label>
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
