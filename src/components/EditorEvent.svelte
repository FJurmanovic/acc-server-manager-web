<script lang="ts">
	import { enhance } from '$app/forms';
	import type { EventConfig } from '$models/config';
	import type { Track } from '$models/lookups';

	const { config, tracks, id }: { config: EventConfig; tracks: Track[]; id: string } = $props();
	const editedConfig = $state({ ...config });
	if (!editedConfig.sessions) editedConfig.sessions = [];
	let formLoading = $state(false);
</script>

<form
	method="POST"
	action="?/event"
	use:enhance={() => {
		formLoading = true;
	}}
>
	<input type="hidden" name="id" value={id} />
	<div class="sm:mx-auto sm:w-full sm:max-w-7xl">
		<div class="border-b border-gray-900/10 pb-12">
			<h2 class="text-base/7 font-semibold text-gray-900">Event</h2>
			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Track:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.track}
								disabled={formLoading}
								name="track"
								class="form form-select"
							>
								{#each tracks as track}
									<option value={track.track}>{track.track}</option>
								{/each}
							</select>
						</div>
					</label>
				</div>
				<div class="sm:col-span-2">
					<label class="block text-sm/6 font-medium text-gray-900">
						Pre-Race waiting time seconds:
						<div class="mt-2">
							<div class="input-block">
								<input
									disabled={formLoading}
									name="preRaceWaitingTimeSeconds"
									type="number"
									class="form form-input"
									bind:value={editedConfig.preRaceWaitingTimeSeconds}
								/>
							</div>
						</div></label
					>
				</div>
				<div class="sm:col-span-2">
					<label class="block text-sm/6 font-medium text-gray-900">
						Session over time seconds:
						<div class="mt-2">
							<div class="input-block">
								<input
									disabled={formLoading}
									name="sessionOverTimeSeconds"
									type="number"
									class="form form-input"
									bind:value={editedConfig.sessionOverTimeSeconds}
								/>
							</div>
						</div></label
					>
				</div>
				<div class="sm:col-span-2">
					<label class="block text-sm/6 font-medium text-gray-900">
						Ambient temp:
						<div class="mt-2">
							<div class="input-block">
								<input
									disabled={formLoading}
									name="ambientTemp"
									type="number"
									class="form form-input"
									bind:value={editedConfig.ambientTemp}
								/>
							</div>
						</div></label
					>
				</div>
				<div class="sm:col-span-2">
					<label class="block text-sm/6 font-medium text-gray-900">
						Cloud level:
						<div class="mt-2">
							<div class="input-block">
								<input
									disabled={formLoading}
									name="cloudLevel"
									type="number"
									class="form form-input"
									bind:value={editedConfig.cloudLevel}
									step=".01"
								/>
							</div>
						</div></label
					>
				</div>
				<div class="sm:col-span-2">
					<label class="block text-sm/6 font-medium text-gray-900">
						Rain:
						<div class="mt-2">
							<div class="input-block">
								<input
									disabled={formLoading}
									name="rain"
									type="number"
									class="form form-input"
									bind:value={editedConfig.rain}
									step=".01"
								/>
							</div>
						</div></label
					>
				</div>
				<div class="sm:col-span-2">
					<label class="block text-sm/6 font-medium text-gray-900">
						Weather randomness:
						<div class="mt-2">
							<div class="input-block">
								<input
									disabled={formLoading}
									name="weatherRandomness"
									type="number"
									class="form form-input"
									bind:value={editedConfig.weatherRandomness}
								/>
							</div>
						</div></label
					>
				</div>
				<div class="sm:col-span-2">
					<label class="block text-sm/6 font-medium text-gray-900">
						Post-Qualy seconds:
						<div class="mt-2">
							<div class="input-block">
								<input
									disabled={formLoading}
									name="postQualySeconds"
									type="number"
									class="form form-input"
									bind:value={editedConfig.postQualySeconds}
								/>
							</div>
						</div></label
					>
				</div>
				<div class="sm:col-span-2">
					<label class="block text-sm/6 font-medium text-gray-900">
						Post-Race seconds:
						<div class="mt-2">
							<div class="input-block">
								<input
									disabled={formLoading}
									name="postRaceSeconds"
									type="number"
									class="form form-input"
									bind:value={editedConfig.postRaceSeconds}
								/>
							</div>
						</div></label
					>
				</div>
				<div class="sm:col-span-2">
					<label class="block text-sm/6 font-medium text-gray-900">
						Simracer weather conditions:
						<div class="mt-2">
							<div class="input-block">
								<input
									disabled={formLoading}
									name="simracerWeatherConditions"
									type="number"
									class="form form-input"
									bind:value={editedConfig.simracerWeatherConditions}
								/>
							</div>
						</div></label
					>
				</div>
				<div class="sm:col-span-2">
					<label class="block text-sm/6 font-medium text-gray-900">
						Is fixed condition qualification:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.isFixedConditionQualification}
								disabled={formLoading}
								name="isFixedConditionQualification"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Sessions:
						<div class="mt-2">
							{#each editedConfig.sessions as session, index}
								<div class="mb-4 rounded-lg border p-4">
									<div class="grid grid-cols-2 gap-4">
										<!-- Hour of Day -->
										<div>
											<label class="block text-sm font-medium text-gray-700"
												>Hour of Day:
												<div class="mt-2">
													<div class="input-block">
														<input
															bind:value={session.hourOfDay}
															name={`sessions[${index}][hourOfDay]`}
															disabled={formLoading}
															type="number"
															class="form form-input"
														/>
													</div>
												</div></label
											>
										</div>
										<!-- Day of Weekend -->
										<div>
											<label class="block text-sm font-medium text-gray-700"
												>Day of Weekend:
												<div class="mt-2">
													<div class="input-block">
														<input
															bind:value={session.dayOfWeekend}
															name={`sessions[${index}][dayOfWeekend]`}
															disabled={formLoading}
															type="number"
															class="form form-input"
														/>
													</div>
												</div>
											</label>
										</div>
										<!-- Time Multiplier -->
										<div>
											<label class="block text-sm font-medium text-gray-700"
												>Time Multiplier:
												<div class="mt-2">
													<div class="input-block">
														<input
															bind:value={session.timeMultiplier}
															name={`sessions[${index}][timeMultiplier]`}
															disabled={formLoading}
															type="number"
															class="form form-input"
														/>
													</div>
												</div></label
											>
										</div>
										<!-- Session Type -->
										<div>
											<label class="block text-sm font-medium text-gray-700"
												>Session Type:
												<div class="mt-2 grid grid-cols-1">
													<select
														bind:value={session.sessionType}
														name={`sessions[${index}][sessionType]`}
														disabled={formLoading}
														class="form form-select"
													>
														<option value="P">Practice</option>
														<option value="Q">Qualifying</option>
														<option value="R">Race</option>
													</select>
												</div></label
											>
										</div>
										<!-- Session Duration Minutes -->
										<div>
											<label class="block text-sm font-medium text-gray-700"
												>Session Duration (Minutes):
												<div class="mt-2">
													<div class="input-block">
														<input
															bind:value={session.sessionDurationMinutes}
															name={`sessions[${index}][sessionDurationMinutes]`}
															disabled={formLoading}
															type="number"
															class="form form-input"
														/>
													</div>
												</div>
											</label>
										</div>
									</div>
									<button
										type="button"
										onclick={() => {
											editedConfig.sessions = editedConfig.sessions.filter((_, i) => i !== index);
										}}
										class="mt-2 text-sm text-red-600 hover:text-red-800"
									>
										Remove Session
									</button>
								</div>
							{/each}
							<button
								type="button"
								onclick={() => {
									editedConfig.sessions = [
										...editedConfig.sessions,
										{
											hourOfDay: 14,
											dayOfWeekend: 1,
											timeMultiplier: 1,
											sessionType: 'Practice',
											sessionDurationMinutes: 60
										}
									];
								}}
								class="btn btn-blue mt-2"
							>
								Add Session
							</button>
						</div>
					</label>
				</div>
			</div>
		</div>
		<div class="mt-6 flex items-center justify-end gap-x-6">
			<label
				><span class="mx-3">Restart server</span><input
					type="checkbox"
					id="restart"
					name="restart"
					checked
				/></label
			>
			<button disabled={formLoading} type="submit" class="btn btn-blue">Save</button>
		</div>
	</div>
</form>

<style></style>
