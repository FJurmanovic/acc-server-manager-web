<script lang="ts">
	import { enhance } from '$app/forms';
	import type { EventConfig } from '$models/config';
	import type { Track } from '$models/lookups';

	const { config, tracks, id }: { config: EventConfig; tracks: Track[]; id: string } = $props();
	const editedConfig = $state({ ...config });
	let sessions = $state(JSON.stringify(editedConfig.sessions));
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
						<div class="mt-2">
							<div class="input-block">
								<input
									disabled={formLoading}
									name="isFixedConditionQualification"
									type="number"
									class="form form-input"
									bind:value={editedConfig.isFixedConditionQualification}
								/>
							</div>
						</div></label
					>
				</div>
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Sessions:
						<div class="mt-2">
							<textarea
								disabled={formLoading}
								name="sessions"
								rows="3"
								class="form form-textarea"
								bind:value={sessions}
							></textarea>
						</div>
					</label>
				</div>
			</div>
		</div>
		<div class="mt-6 flex items-center justify-end gap-x-6">
			<button disabled={formLoading} type="submit" class="btn btn-blue">Save</button>
		</div>
	</div>
</form>

<style></style>
