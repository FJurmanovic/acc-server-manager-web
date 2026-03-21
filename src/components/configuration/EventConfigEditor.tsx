'use client';

import { useState } from 'react';
import type { EventConfig, Session } from '@/lib/schemas/config';
import { updateEventConfigAction } from '@/lib/actions/configuration';

interface EventConfigEditorProps {
	serverId: string;
	formData: EventConfig;
	restart: boolean;
	onFormDataChange: (data: EventConfig) => void;
	onRestartChange: (restart: boolean) => void;
}

const sessionTypes = [
	{ value: 'P', label: 'Practice' },
	{ value: 'Q', label: 'Qualifying' },
	{ value: 'R', label: 'Race' }
];

export function EventConfigEditor({ serverId, formData, restart, onFormDataChange, onRestartChange }: EventConfigEditorProps) {
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

		onFormDataChange({
			...formData,
			[key]:
				typeof formData[key] === 'number'
					? typeof value === 'string'
						? parseFloat(value) || 0
						: value
					: value
		});
	};

	const handleSessionChange = (index: number, field: keyof Session, value: string | number) => {
		const newSessions = [...formData.sessions];
		newSessions[index] = {
			...newSessions[index],
			[field]:
				field === 'sessionType' ? value : typeof value === 'string' ? parseFloat(value) || 0 : value
		};
		onFormDataChange({ ...formData, sessions: newSessions });
	};

	const addSession = () => {
		const newSession: Session = {
			hourOfDay: 12,
			dayOfWeekend: 1,
			timeMultiplier: 1,
			sessionType: 'P',
			sessionDurationMinutes: 20
		};
		onFormDataChange({ ...formData, sessions: [...formData.sessions, newSession] });
	};

	const removeSession = (index: number) => {
		onFormDataChange({ ...formData, sessions: formData.sessions.filter((_, i) => i !== index) });
	};

	return (
		<form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
			<div className="space-y-6">
				<h3 className="border-b border-border-muted pb-2 text-sm font-semibold text-primary">
					Basic Event Settings
				</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label className="mb-1.5 block text-sm font-medium text-secondary">Track</label>
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
						<label className="mb-1.5 block text-sm font-medium text-secondary">
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
						<label className="mb-1.5 block text-sm font-medium text-secondary">
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
						<label className="mb-1.5 block text-sm font-medium text-secondary">
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
						<label className="mb-1.5 block text-sm font-medium text-secondary">
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
				<h3 className="border-b border-border-muted pb-2 text-sm font-semibold text-primary">
					Weather Settings
				</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					<div>
						<label className="mb-1.5 block text-sm font-medium text-secondary">
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
						<label className="mb-1.5 block text-sm font-medium text-secondary">
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
						<label className="mb-1.5 block text-sm font-medium text-secondary">Rain (0.0-1.0)</label>
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
						<label className="mb-1.5 block text-sm font-medium text-secondary">
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
						<label className="mb-1.5 block text-sm font-medium text-secondary">
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
						<label className="mb-1.5 block text-sm font-medium text-secondary">
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
				<div className="flex items-center justify-between border-b border-border-muted pb-2">
					<h3 className="text-sm font-semibold text-primary">Sessions</h3>
					<button
						type="button"
						onClick={addSession}
						disabled={isSubmitting}
						className="rounded-md border border-border bg-overlay px-3 py-1.5 text-xs font-medium text-secondary hover:bg-border disabled:opacity-40"
					>
						+ Add Session
					</button>
				</div>

				<div className="space-y-4">
					{formData.sessions.map((session, index) => (
						<div key={index} className="rounded-lg border border-border bg-canvas p-4">
							<div className="mb-4 flex items-center justify-between">
								<h4 className="text-sm font-medium text-primary">Session {index + 1}</h4>
								<button
									type="button"
									onClick={() => removeSession(index)}
									disabled={isSubmitting}
									className="rounded px-2 py-1 text-xs text-red hover:bg-red-bg disabled:opacity-40"
								>
									Remove
								</button>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
								<div>
									<label className="mb-1 block text-xs font-medium text-muted">
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
									<label className="mb-1 block text-xs font-medium text-muted">
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
									<label className="mb-1 block text-xs font-medium text-muted">
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
									<label className="mb-1 block text-xs font-medium text-muted">
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
									<label className="mb-1 block text-xs font-medium text-muted">
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

			<div className="border-t border-border pt-6">
				<label className="flex items-center gap-2 text-sm text-muted">
					<input
						type="checkbox"
						checked={restart}
						onChange={(e) => onRestartChange(e.target.checked)}
						className="h-4 w-4 rounded border-border bg-overlay accent-green focus:ring-1 focus:ring-blue"
					/>
					Restart server after saving
				</label>
			</div>

			<div className="flex justify-end">
				<button
					type="submit"
					disabled={isSubmitting}
					className="rounded-md bg-btn-green border border-btn-green px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-btn-green-hover disabled:cursor-not-allowed disabled:opacity-40"
				>
					{isSubmitting ? 'Saving…' : 'Save Changes'}
				</button>
			</div>
		</form>
	);
}
