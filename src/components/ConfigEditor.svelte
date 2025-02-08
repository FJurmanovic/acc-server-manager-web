<script>
	let { config, tracks, id } = $props();
	let editedConfig = { ...config['event'] };
	editedConfig.sessions = JSON.stringify(editedConfig.sessions);
	console.log(editedConfig);
</script>

<form method="POST" action="?/event">
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
								name="track"
								class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
							<div
								class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600"
							>
								<input
									name="preRaceWaitingTimeSeconds"
									type="number"
									class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
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
							<div
								class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600"
							>
								<input
									name="sessionOverTimeSeconds"
									type="number"
									class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
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
							<div
								class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600"
							>
								<input
									name="ambientTemp"
									type="number"
									class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
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
							<div
								class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600"
							>
								<input
									name="cloudLevel"
									type="number"
									class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
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
							<div
								class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600"
							>
								<input
									name="rain"
									type="number"
									class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
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
							<div
								class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600"
							>
								<input
									name="weatherRandomness"
									type="number"
									class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
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
							<div
								class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600"
							>
								<input
									name="postQualySeconds"
									type="number"
									class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
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
							<div
								class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600"
							>
								<input
									name="postRaceSeconds"
									type="number"
									class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
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
							<div
								class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600"
							>
								<input
									name="simracerWeatherConditions"
									type="number"
									class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
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
							<div
								class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600"
							>
								<input
									name="isFixedConditionQualification"
									type="number"
									class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
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
								name="sessions"
								rows="3"
								class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
								bind:value={editedConfig.sessions}
							></textarea>
						</div>
					</label>
				</div>
			</div>
		</div>
		<div class="mt-6 flex items-center justify-end gap-x-6">
			<button
				type="submit"
				class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				>Save</button
			>
		</div>
	</div>
</form>

<style></style>
