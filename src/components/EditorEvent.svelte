<script lang="ts">
	import { enhance } from '$app/forms';
	import { configFile, type EventConfig } from '$models/config';
	import type { Track } from '$models/lookups';

	const { config, tracks, id }: { config: EventConfig; tracks: Track[]; id: string } = $props();
	const editedConfig = $state({ ...config });
	if (!editedConfig.sessions) editedConfig.sessions = [];
	let formLoading = $state(false);
	let restart = $state(true);
</script>

<form
	method="POST"
	action="?/update"
	use:enhance={() => {
		formLoading = true;
		return async ({ update }) => {
			await update({ invalidateAll: true, reset: false });
			formLoading = false;
		};
	}}
	class="space-y-6 max-w-3xl"
>
	<input type="hidden" name="id" value={id} />
	<input type="hidden" name="file" value={configFile.event} />
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Track:
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
			</label>
		</div>
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Pre-Race waiting time seconds:
				<input
					disabled={formLoading}
					name="preRaceWaitingTimeSeconds"
					type="number"
					class="form form-input"
					bind:value={editedConfig.preRaceWaitingTimeSeconds}
				/>
			</label>
		</div>
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Session over time seconds:
				<input
					disabled={formLoading}
					name="sessionOverTimeSeconds"
					type="number"
					class="form form-input"
					bind:value={editedConfig.sessionOverTimeSeconds}
				/>
			</label>
		</div>
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Ambient temp:
				<input
					disabled={formLoading}
					name="ambientTemp"
					type="number"
					class="form form-input"
					bind:value={editedConfig.ambientTemp}
				/>
			</label>
		</div>
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Cloud level:
				<input
					disabled={formLoading}
					name="cloudLevel"
					type="number"
					class="form form-input"
					bind:value={editedConfig.cloudLevel}
					step=".01"
				/>
			</label>
		</div>
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Rain:
				<input
					disabled={formLoading}
					name="rain"
					type="number"
					class="form form-input"
					bind:value={editedConfig.rain}
					step=".01"
				/>
			</label>
		</div>
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Weather randomness:
				<input
					disabled={formLoading}
					name="weatherRandomness"
					type="number"
					class="form form-input"
					bind:value={editedConfig.weatherRandomness}
				/>
			</label>
		</div>
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Post-Qualy seconds:
				<input
					disabled={formLoading}
					name="postQualySeconds"
					type="number"
					class="form form-input"
					bind:value={editedConfig.postQualySeconds}
				/>
			</label>
		</div>
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Post-Race seconds:
				<input
					disabled={formLoading}
					name="postRaceSeconds"
					type="number"
					class="form form-input"
					bind:value={editedConfig.postRaceSeconds}
				/>
			</label>
		</div>
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Simracer weather conditions:
				<input
					disabled={formLoading}
					name="simracerWeatherConditions"
					type="number"
					class="form form-input"
					bind:value={editedConfig.simracerWeatherConditions}
				/>
			</label>
		</div>
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Is fixed condition qualification:
				<select
					bind:value={editedConfig.isFixedConditionQualification}
					disabled={formLoading}
					name="isFixedConditionQualification"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>
		<div />
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Sessions:
    			<div class="mt-2 space-y-4">
					{#each editedConfig.sessions as session, index}
						<div class="mb-4 rounded-lg border border-gray-700 bg-gray-800 p-4">
          					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<!-- Hour of Day -->
								<div>
									<label class="block text-sm font-medium text-gray-300 mb-1"
										>Hour of Day:
										<input
											bind:value={session.hourOfDay}
											name={`sessions[${index}].hourOfDay`}
											disabled={formLoading}
											type="number"
											class="form form-input"
										/>
									</label>
								</div>
								<!-- Day of Weekend -->
								<div>
									<label class="block text-sm font-medium text-gray-300 mb-1">
										Day of Weekend:
										<input
											bind:value={session.dayOfWeekend}
											name={`sessions[${index}].dayOfWeekend`}
											disabled={formLoading}
											type="number"
											class="form form-input"
										/>
									</label>
								</div>
								<!-- Time Multiplier -->
								<div>
									<label class="block text-sm font-medium text-gray-300 mb-1">
										Time Multiplier:
										<input
											bind:value={session.timeMultiplier}
											name={`sessions[${index}].timeMultiplier`}
											disabled={formLoading}
											type="number"
											class="form form-input"
										/>
									</label>
								</div>
								<!-- Session Type -->
								<div>
									<label class="block text-sm font-medium text-gray-300 mb-1">
										Session Type:
										<select
											bind:value={session.sessionType}
											name={`sessions[${index}].sessionType`}
											disabled={formLoading}
											class="form form-select"
										>
											<option value="P">Practice</option>
											<option value="Q">Qualifying</option>
											<option value="R">Race</option>
										</select>
									</label>
								</div>
								<!-- Session Duration Minutes -->
								<div>
									<label class="block text-sm font-medium text-gray-300 mb-1">
										Session Duration (Minutes):
										<input
											bind:value={session.sessionDurationMinutes}
											name={`sessions[${index}].sessionDurationMinutes`}
											disabled={formLoading}
											type="number"
											class="form form-input"
										/>
									</label>
								</div>
							</div>
							<button
								type="button"
								onclick={() => {
									editedConfig.sessions = editedConfig.sessions.filter((_, i) => i !== index);
								}}
								class="mt-4 px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-xs font-medium text-white flex items-center"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
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
        				class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium text-white flex items-center"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
						Add Session
					</button>
				</div>
			</label>
		</div>
	</div>
	<div class="pt-4 border-t border-gray-700">
		<label class="flex items-center">
			<input 
			type="checkbox" 
			bind:checked={restart}
			class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-600 rounded bg-gray-700"
			/>
			<span class="ml-2 text-sm text-gray-300">Restart server after saving</span>
		</label>
		</div>
		
		<div class="flex justify-end">
		<button 
			type="submit"  
			disabled={formLoading}
			class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium"
		>
			Save Changes
		</button>
	</div>
</form>

<style></style>
