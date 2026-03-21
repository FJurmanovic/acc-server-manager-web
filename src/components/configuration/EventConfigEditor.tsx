'use client';

import { useState } from 'react';
import type { EventConfig, Session } from '@/lib/schemas/config';
import { updateEventConfigAction } from '@/lib/actions/configuration';

interface EventConfigEditorProps {
	serverId: string;
	config: EventConfig;
}

const sessionTypes = [
	{ value: 'P', label: 'Practice' },
	{ value: 'Q', label: 'Qualifying' },
	{ value: 'R', label: 'Race' }
];

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

	return (
		<form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
			<div className="space-y-6">
				<h3 className="border-b border-gh-border-muted pb-2 text-sm font-semibold text-gh-primary">
					Basic Event Settings
				</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gh-secondary">Track</label>
						<select
							disabled={isSubmitting}
							value={formData.track}
							onChange={(e) => handleInputChange('track', e.target.value)}
							className="form-select w-full"
						>
							<option value="barcelona">Barcelona</option>
							<option value="brands_hatch">Brands Hatch</option>
							<option value="donington">Donington</option>
							<option value="cota">COTA</option>
							<option value="hungaroring">Hungaroring</option>
							<option value="imola">Imola</option>
							<option value="indianapolis">Indianapolis</option>
							<option value="kyalami">Kyalami</option>
							<option value="laguna_seca">Laguna Seca</option>
							<option value="misano">Misano</option>
							<option value="monza">Monza</option>
							<option value="mount_panorama">Mount Panorama</option>
							<option value="nurburgring">Nurburgring</option>
							<option value="nurburgring_24h">Nurburgring 24h</option>
							<option value="oulton_park">Oulton Park</option>
							<option value="paul_ricard">Paul Ricard</option>
							<option value="red_bull_ring">Red Bull Ring</option>
							<option value="silverstone">Silverstone</option>
							<option value="snetterton">Snetterton</option>
							<option value="spa">Spa-Francorchamps</option>
							<option value="suzuka">Suzuka</option>
							<option value="valencia">Valencia</option>
							<option value="zandvoort">Zandvoort</option>
							<option value="zolder">Zolder</option>
							<option value="watkins_glen">Watkins Glen</option>
						</select>
					</div>

					<div>
						<label className="mb-1.5 block text-sm font-medium text-gh-secondary">
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
						<label className="mb-1.5 block text-sm font-medium text-gh-secondary">
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
						<label className="mb-1.5 block text-sm font-medium text-gh-secondary">
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
						<label className="mb-1.5 block text-sm font-medium text-gh-secondary">
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
				<h3 className="border-b border-gh-border-muted pb-2 text-sm font-semibold text-gh-primary">
					Weather Settings
				</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gh-secondary">
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
						<label className="mb-1.5 block text-sm font-medium text-gh-secondary">
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
						<label className="mb-1.5 block text-sm font-medium text-gh-secondary">Rain (0.0-1.0)</label>
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
						<label className="mb-1.5 block text-sm font-medium text-gh-secondary">
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
						<label className="mb-1.5 block text-sm font-medium text-gh-secondary">
							Simracer Weather Conditions
						</label>
						<select
							disabled={isSubmitting}
							value={formData.simracerWeatherConditions}
							onChange={(e) => handleInputChange('simracerWeatherConditions', e.target.value)}
							className="form-select w-full"
						>
							<option value={0}>No</option>
							<option value={1}>Yes</option>
						</select>
					</div>

					<div>
						<label className="mb-1.5 block text-sm font-medium text-gh-secondary">
							Fixed Condition Qualification
						</label>
						<select
							disabled={isSubmitting}
							value={formData.isFixedConditionQualification}
							onChange={(e) => handleInputChange('isFixedConditionQualification', e.target.value)}
							className="form-select w-full"
						>
							<option value={0}>No</option>
							<option value={1}>Yes</option>
						</select>
					</div>
				</div>
			</div>

			<div className="space-y-6">
				<div className="flex items-center justify-between border-b border-gh-border-muted pb-2">
					<h3 className="text-sm font-semibold text-gh-primary">Sessions</h3>
					<button
						type="button"
						onClick={addSession}
						disabled={isSubmitting}
						className="rounded-md border border-gh-border bg-gh-overlay px-3 py-1.5 text-xs font-medium text-gh-secondary hover:bg-gh-border disabled:opacity-40"
					>
						+ Add Session
					</button>
				</div>

				<div className="space-y-4">
					{formData.sessions.map((session, index) => (
						<div key={index} className="rounded-lg border border-gh-border bg-gh-canvas p-4">
							<div className="mb-4 flex items-center justify-between">
								<h4 className="text-sm font-medium text-gh-primary">Session {index + 1}</h4>
								<button
									type="button"
									onClick={() => removeSession(index)}
									disabled={isSubmitting}
									className="rounded px-2 py-1 text-xs text-gh-red hover:bg-gh-red-bg disabled:opacity-40"
								>
									Remove
								</button>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
								<div>
									<label className="mb-1 block text-xs font-medium text-gh-muted">
										Session Type
									</label>
									<select
										disabled={isSubmitting}
										value={session.sessionType}
										onChange={(e) => handleSessionChange(index, 'sessionType', e.target.value)}
										className="form-select w-full text-sm"
									>
										{sessionTypes.map((type) => (
											<option key={type.value} value={type.value}>
												{type.label}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="mb-1 block text-xs font-medium text-gh-muted">
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
									<label className="mb-1 block text-xs font-medium text-gh-muted">
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
									<label className="mb-1 block text-xs font-medium text-gh-muted">
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
									<label className="mb-1 block text-xs font-medium text-gh-muted">
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

			<div className="border-t border-gh-border pt-6">
				<label className="flex items-center gap-2 text-sm text-gh-muted">
					<input
						type="checkbox"
						checked={restart}
						onChange={(e) => setRestart(e.target.checked)}
						className="h-4 w-4 rounded border-gh-border bg-gh-overlay accent-gh-green focus:ring-1 focus:ring-gh-blue"
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
