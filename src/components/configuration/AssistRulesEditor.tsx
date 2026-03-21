'use client';

import { useState } from 'react';
import type { AssistRules } from '@/lib/schemas/config';
import { updateAssistRulesAction } from '@/lib/actions/configuration';

interface AssistRulesEditorProps {
	serverId: string;
	config: AssistRules;
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

export function AssistRulesEditor({ serverId, config }: AssistRulesEditorProps) {
	const [formData, setFormData] = useState<AssistRules>(config);
	const [restart, setRestart] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		const formDataObj = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			formDataObj.append(key, value.toString());
		});
		if (restart) {
			formDataObj.append('restart', 'on');
		}

		try {
			const result = await updateAssistRulesAction(serverId, formDataObj);
			if (!result.success) {
				console.error('Failed to update assist rules:', result.message);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleInputChange = (key: keyof AssistRules, value: string | number) => {
		setFormData((prev) => ({
			...prev,
			[key]: typeof value === 'string' ? parseInt(value) : value
		}));
	};

	return (
		<form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{assistFields.map(({ key, label, type }) => (
					<div key={key}>
						<label className="mb-1.5 block text-sm font-medium text-gh-secondary">{label}</label>
						{type === 'number' ? (
							<input
								type="number"
								disabled={isSubmitting}
								value={formData[key]}
								onChange={(e) => handleInputChange(key, e.target.value)}
								className="form-input w-full"
								min="0"
								max="5"
							/>
						) : (
							<select
								disabled={isSubmitting}
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

			<div className="border-t border-gh-border pt-6">
				<label className="flex items-center gap-2 text-sm text-gh-muted">
					<input
						type="checkbox"
						checked={restart}
						onChange={(e) => setRestart(e.target.checked)}
						className="h-4 w-4 rounded border-gh-border bg-gh-overlay accent-gh-green focus:ring-gh-blue"
					/>
					Restart server after saving
				</label>
			</div>

			<div className="flex justify-end">
				<button
					type="submit"
					disabled={isSubmitting}
					className="rounded-md bg-gh-btn-green border border-gh-btn-green px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gh-btn-green-hover disabled:cursor-not-allowed disabled:opacity-40"
				>
					{isSubmitting ? 'Saving…' : 'Save Changes'}
				</button>
			</div>
		</form>
	);
}
