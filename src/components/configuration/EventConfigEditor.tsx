'use client';

import { useState } from 'react';
import type { EventConfig, Session } from '@/lib/types/config';
import { updateEventConfigAction } from '@/lib/actions/configuration';

interface EventConfigEditorProps {
	serverId: string;
	config: EventConfig;
}

export function EventConfigEditor({ serverId, config }: EventConfigEditorProps) {
	const [formData, setFormData] = useState<EventConfig>(config);
	const [restart, setRestart] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		const formDataObj = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			if (key === 'sessions') {
				formDataObj.append(key, JSON.stringify(value));
			} else {
				formDataObj.append(key, value.toString());
			}
		});
		if (restart) {
			formDataObj.append('restart', 'on');
		}

		try {
			const result = await updateEventConfigAction(serverId, formDataObj);
			if (!result.success) {
				console.error('Failed to update event config:', result.message);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleInputChange = (key: keyof EventConfig, value: string | number) => {
		if (key === 'sessions') return;

		setFormData((prev) => ({
			...prev,
			[key]:
				typeof formData[key] === 'number'
					? typeof value === 'string'
						? parseFloat(value) || 0
						: value
					: value
		}));
	};

	const handleSessionChange = (index: number, field: keyof Session, value: string | number) => {
		const newSessions = [...formData.sessions];
		newSessions[index] = {
			...newSessions[index],
			[field]:
				field === 'sessionType' ? value : typeof value === 'string' ? parseFloat(value) || 0 : value
		};

		setFormData((prev) => ({
			...prev,
			sessions: newSessions
		}));
	};

	const addSession = () => {
		const newSession: Session = {
			hourOfDay: 12,
			dayOfWeekend: 1,
			timeMultiplier: 1,
			sessionType: 'P',
			sessionDurationMinutes: 20
		};

		setFormData((prev) => ({
			...prev,
			sessions: [...prev.sessions, newSession]
		}));
	};

	const removeSession = (index: number) => {
		setFormData((prev) => ({
			...prev,
			sessions: prev.sessions.filter((_, i) => i !== index)
		}));
	};

	const sessionTypes = [
		{ value: 'P', label: 'Practice' },
		{ value: 'Q', label: 'Qualifying' },
		{ value: 'R', label: 'Race' }
	];

	return (
		<form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
			<div className="space-y-6">
				<h3 className="border-b border-gray-700 pb-2 text-lg font-medium text-white">
					Basic Event Settings
				</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">Track</label>
						<select
							disabled={isSubmitting}
							value={formData.track}
							onChange={(e) => handleInputChange('track', e.target.value)}
							className="form-input w-full"
						>
							<option value="barcelona">Barcelona</option>
							<option value="brands_hatch">Brands Hatch</option>
							<option value="hungaroring">Hungaroring</option>
							<option value="imola">Imola</option>
							<option value="kyalami">Kyalami</option>
							<option value="laguna_seca">Laguna Seca</option>
							<option value="misano">Misano</option>
							<option value="monza">Monza</option>
							<option value="mount_panorama">Mount Panorama</option>
							<option value="nurburgring">Nurburgring</option>
							<option value="oulton_park">Oulton Park</option>
							<option value="paul_ricard">Paul Ricard</option>
							<option value="silverstone">Silverstone</option>
							<option value="snetterton">Snetterton</option>
							<option value="spa">Spa-Francorchamps</option>
							<option value="suzuka">Suzuka</option>
							<option value="zandvoort">Zandvoort</option>
							<option value="zolder">Zolder</option>
						</select>
					</div>

					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">
							Pre-Race Waiting Time (seconds)
						</label>
						<input
							type="number"
							disabled={isSubmitting}
							value={formData.preRaceWaitingTimeSeconds}
							onChange={(e) => handleInputChange('preRaceWaitingTimeSeconds', e.target.value)}
							className="form-input w-full"
							min="0"
						/>
					</div>

					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">
							Session Over Time (seconds)
						</label>
						<input
							type="number"
							disabled={isSubmitting}
							value={formData.sessionOverTimeSeconds}
							onChange={(e) => handleInputChange('sessionOverTimeSeconds', e.target.value)}
							className="form-input w-full"
							min="0"
						/>
					</div>

					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">
							Post Qualify Seconds
						</label>
						<input
							type="number"
							disabled={isSubmitting}
							value={formData.postQualySeconds}
							onChange={(e) => handleInputChange('postQualySeconds', e.target.value)}
							className="form-input w-full"
							min="0"
						/>
					</div>

					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">
							Post Race Seconds
						</label>
						<input
							type="number"
							disabled={isSubmitting}
							value={formData.postRaceSeconds}
							onChange={(e) => handleInputChange('postRaceSeconds', e.target.value)}
							className="form-input w-full"
							min="0"
						/>
					</div>
				</div>
			</div>

			<div className="space-y-6">
				<h3 className="border-b border-gray-700 pb-2 text-lg font-medium text-white">
					Weather Settings
				</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">
							Ambient Temperature (°C)
						</label>
						<input
							type="number"
							disabled={isSubmitting}
							value={formData.ambientTemp}
							onChange={(e) => handleInputChange('ambientTemp', e.target.value)}
							className="form-input w-full"
							min="0"
							max="50"
						/>
					</div>

					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">
							Cloud Level (0.0-1.0)
						</label>
						<input
							type="number"
							disabled={isSubmitting}
							value={formData.cloudLevel}
							onChange={(e) => handleInputChange('cloudLevel', e.target.value)}
							className="form-input w-full"
							min="0"
							max="1"
							step="0.01"
						/>
					</div>

					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">Rain (0.0-1.0)</label>
						<input
							type="number"
							disabled={isSubmitting}
							value={formData.rain}
							onChange={(e) => handleInputChange('rain', e.target.value)}
							className="form-input w-full"
							min="0"
							max="1"
							step="0.01"
						/>
					</div>

					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">
							Weather Randomness
						</label>
						<input
							type="number"
							disabled={isSubmitting}
							value={formData.weatherRandomness}
							onChange={(e) => handleInputChange('weatherRandomness', e.target.value)}
							className="form-input w-full"
							min="0"
							max="7"
						/>
					</div>

					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">
							Simracer Weather Conditions
						</label>
						<select
							disabled={isSubmitting}
							value={formData.simracerWeatherConditions}
							onChange={(e) => handleInputChange('simracerWeatherConditions', e.target.value)}
							className="form-input w-full"
						>
							<option value={0}>No</option>
							<option value={1}>Yes</option>
						</select>
					</div>

					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">
							Fixed Condition Qualification
						</label>
						<select
							disabled={isSubmitting}
							value={formData.isFixedConditionQualification}
							onChange={(e) => handleInputChange('isFixedConditionQualification', e.target.value)}
							className="form-input w-full"
						>
							<option value={0}>No</option>
							<option value={1}>Yes</option>
						</select>
					</div>
				</div>
			</div>

			<div className="space-y-6">
				<div className="flex items-center justify-between border-b border-gray-700 pb-2">
					<h3 className="text-lg font-medium text-white">Sessions</h3>
					<button
						type="button"
						onClick={addSession}
						disabled={isSubmitting}
						className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
					>
						Add Session
					</button>
				</div>

				<div className="space-y-4">
					{formData.sessions.map((session, index) => (
						<div key={index} className="rounded-lg bg-gray-800 p-4">
							<div className="mb-4 flex items-center justify-between">
								<h4 className="text-sm font-medium text-white">Session {index + 1}</h4>
								<button
									type="button"
									onClick={() => removeSession(index)}
									disabled={isSubmitting}
									className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
								>
									Remove
								</button>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
								<div>
									<label className="mb-1 block text-xs font-medium text-gray-400">
										Session Type
									</label>
									<select
										disabled={isSubmitting}
										value={session.sessionType}
										onChange={(e) => handleSessionChange(index, 'sessionType', e.target.value)}
										className="form-input w-full text-sm"
									>
										{sessionTypes.map((type) => (
											<option key={type.value} value={type.value}>
												{type.label}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="mb-1 block text-xs font-medium text-gray-400">
										Hour of Day
									</label>
									<input
										type="number"
										disabled={isSubmitting}
										value={session.hourOfDay}
										onChange={(e) => handleSessionChange(index, 'hourOfDay', e.target.value)}
										className="form-input w-full text-sm"
										min="0"
										max="23"
									/>
								</div>

								<div>
									<label className="mb-1 block text-xs font-medium text-gray-400">
										Day of Weekend
									</label>
									<input
										type="number"
										disabled={isSubmitting}
										value={session.dayOfWeekend}
										onChange={(e) => handleSessionChange(index, 'dayOfWeekend', e.target.value)}
										className="form-input w-full text-sm"
										min="1"
										max="3"
									/>
								</div>

								<div>
									<label className="mb-1 block text-xs font-medium text-gray-400">
										Time Multiplier
									</label>
									<input
										type="number"
										disabled={isSubmitting}
										value={session.timeMultiplier}
										onChange={(e) => handleSessionChange(index, 'timeMultiplier', e.target.value)}
										className="form-input w-full text-sm"
										min="1"
										max="24"
									/>
								</div>

								<div>
									<label className="mb-1 block text-xs font-medium text-gray-400">
										Duration (minutes)
									</label>
									<input
										type="number"
										disabled={isSubmitting}
										value={session.sessionDurationMinutes}
										onChange={(e) =>
											handleSessionChange(index, 'sessionDurationMinutes', e.target.value)
										}
										className="form-input w-full text-sm"
										min="1"
									/>
								</div>
							</div>
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
