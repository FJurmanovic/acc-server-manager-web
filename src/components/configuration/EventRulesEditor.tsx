'use client';

import { useState } from 'react';
import type { EventRules } from '@/lib/schemas/config';
import { updateEventRulesAction } from '@/lib/actions/configuration';

interface EventRulesEditorProps {
	serverId: string;
	config: EventRules;
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

export function EventRulesEditor({ serverId, config }: EventRulesEditorProps) {
	const [formData, setFormData] = useState<EventRules>(config);
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
			const result = await updateEventRulesAction(serverId, formDataObj);
			if (!result.success) {
				console.error('Failed to update event rules:', result.message);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleInputChange = (key: keyof EventRules, value: string | number | boolean) => {
		setFormData((prev) => ({
			...prev,
			[key]: value
		}));
	};

	return (
		<form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
			<div className="space-y-6">
				<h3 className="border-b border-gh-border-muted pb-2 text-sm font-semibold text-gh-primary">Race Rules</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{numberFields.map(({ key, label, min, max }) => (
						<div key={key}>
							<label className="mb-1.5 block text-sm font-medium text-gh-secondary">{label}</label>
							<input
								type="number"
								disabled={isSubmitting}
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
				<h3 className="border-b border-gh-border-muted pb-2 text-sm font-semibold text-gh-primary">
					Pitstop & Refuelling Rules
				</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{booleanFields.map(({ key, label }) => (
						<div key={key}>
							<label className="mb-1.5 block text-sm font-medium text-gh-secondary">{label}</label>
							<select
								disabled={isSubmitting}
								value={formData[key] ? 'true' : 'false'}
								onChange={(e) => handleInputChange(key, e.target.value === 'true')}
								className="form-select w-full"
							>
								<option value="false">No</option>
								<option value="true">Yes</option>
							</select>
						</div>
					))}
				</div>
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
