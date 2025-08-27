'use client';

import { useState } from 'react';
import type { EventRules } from '@/lib/types/config';
import { updateEventRulesAction } from '@/lib/actions/configuration';

interface EventRulesEditorProps {
	serverId: string;
	config: EventRules;
}

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

	return (
		<form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
			<div className="space-y-6">
				<h3 className="border-b border-gray-700 pb-2 text-lg font-medium text-white">Race Rules</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{numberFields.map(({ key, label, min, max }) => (
						<div key={key}>
							<label className="mb-2 block text-sm font-medium text-gray-300">{label}</label>
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
				<h3 className="border-b border-gray-700 pb-2 text-lg font-medium text-white">
					Pitstop & Refuelling Rules
				</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{booleanFields.map(({ key, label }) => (
						<div key={key}>
							<label className="mb-2 block text-sm font-medium text-gray-300">{label}</label>
							<select
								disabled={isSubmitting}
								value={formData[key] ? 'true' : 'false'}
								onChange={(e) => handleInputChange(key, e.target.value === 'true')}
								className="form-input w-full"
							>
								<option value="false">No</option>
								<option value="true">Yes</option>
							</select>
						</div>
					))}
				</div>
			</div>

			<div className="border-t border-gray-700 pt-6">
				<label className="flex items-center">
					<input
						type="checkbox"
						checked={restart}
						onChange={(e) => setRestart(e.target.checked)}
						className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-600 focus:ring-green-500"
					/>
					<span className="ml-2 text-sm text-gray-300">Restart server after saving</span>
				</label>
			</div>

			<div className="flex justify-end">
				<button
					type="submit"
					disabled={isSubmitting}
					className="rounded-md bg-green-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isSubmitting ? 'Saving...' : 'Save Changes'}
				</button>
			</div>
		</form>
	);
}
