<script lang="ts">
	import { enhance } from '$app/forms';
	import { configFile, type ServerSettings } from '$models/config';

	const { config, id }: { config: ServerSettings; id: string } = $props();
	const editedConfig = $state({ ...config });
	let formLoading = $state(false);
	const carGroups = ['FreeForAll', 'GT3', 'GT4', 'GT2', 'GTC', 'TCX'];
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
>
	<input type="hidden" name="id" value={id} />
	<input type="hidden" name="file" value={configFile.settings} />
	<div class="sm:mx-auto sm:w-full sm:max-w-7xl">
		<div class="border-b border-gray-900/10 pb-12">
			<h2 class="text-base/7 font-semibold text-gray-900">Settings</h2>
			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<!-- Server Name -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Server Name:
						<div class="mt-2">
							<div class="input-block">
								<input
									bind:value={editedConfig.serverName}
									disabled={formLoading}
									name="serverName"
									type="text"
									class="form form-input"
								/>
							</div>
						</div>
					</label>
				</div>

				<!-- Admin Password -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Admin Password:
						<div class="mt-2">
							<div class="input-block">
								<input
									bind:value={editedConfig.adminPassword}
									disabled={formLoading}
									name="adminPassword"
									type="password"
									class="form form-input"
								/>
							</div>
						</div>
					</label>
				</div>

				<!-- Car Group -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Car Group:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.carGroup}
								disabled={formLoading}
								name="carGroup"
								class="form form-select"
							>
								{#each carGroups as group}
									<option value={group}>{group}</option>
								{/each}
							</select>
						</div>
					</label>
				</div>

				<!-- Track Medals Requirement -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Track Medals Requirement:
						<div class="mt-2">
							<div class="input-block">
								<input
									bind:value={editedConfig.trackMedalsRequirement}
									disabled={formLoading}
									name="trackMedalsRequirement"
									type="number"
									class="form form-input"
								/>
							</div>
						</div>
					</label>
				</div>

				<!-- Safety Rating Requirement -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Safety Rating Requirement:
						<div class="mt-2">
							<div class="input-block">
								<input
									bind:value={editedConfig.safetyRatingRequirement}
									disabled={formLoading}
									name="safetyRatingRequirement"
									type="number"
									class="form form-input"
								/>
							</div>
						</div>
					</label>
				</div>

				<!-- Racecraft Rating Requirement -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Racecraft Rating Requirement:
						<div class="mt-2">
							<div class="input-block">
								<input
									bind:value={editedConfig.racecraftRatingRequirement}
									disabled={formLoading}
									name="racecraftRatingRequirement"
									type="number"
									class="form form-input"
								/>
							</div>
						</div>
					</label>
				</div>

				<!-- Password -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Password:
						<div class="mt-2">
							<div class="input-block">
								<input
									bind:value={editedConfig.password}
									disabled={formLoading}
									name="password"
									type="password"
									class="form form-input"
								/>
							</div>
						</div>
					</label>
				</div>

				<!-- Spectator Password -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Spectator Password:
						<div class="mt-2">
							<div class="input-block">
								<input
									bind:value={editedConfig.spectatorPassword}
									disabled={formLoading}
									name="spectatorPassword"
									type="password"
									class="form form-input"
								/>
							</div>
						</div>
					</label>
				</div>

				<!-- Max Car Slots -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Max Car Slots:
						<div class="mt-2">
							<div class="input-block">
								<input
									bind:value={editedConfig.maxCarSlots}
									disabled={formLoading}
									name="maxCarSlots"
									type="number"
									class="form form-input"
								/>
							</div>
						</div>
					</label>
				</div>

				<!-- Dump Leaderboards -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Dump Leaderboards:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.dumpLeaderboards}
								disabled={formLoading}
								name="dumpLeaderboards"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>

				<!-- Is Race Locked -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Is Race Locked:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.isRaceLocked}
								disabled={formLoading}
								name="isRaceLocked"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>

				<!-- Randomize Track When Empty -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Randomize Track When Empty:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.randomizeTrackWhenEmpty}
								disabled={formLoading}
								name="randomizeTrackWhenEmpty"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>

				<!-- Central Entry List Path -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Central Entry List Path:
						<div class="mt-2">
							<div class="input-block">
								<input
									bind:value={editedConfig.centralEntryListPath}
									disabled={formLoading}
									name="centralEntryListPath"
									type="text"
									class="form form-input"
								/>
							</div>
						</div>
					</label>
				</div>

				<!-- Allow Auto DQ -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Allow Auto DQ:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.allowAutoDQ}
								disabled={formLoading}
								name="allowAutoDQ"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>

				<!-- Short Formation Lap -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Short Formation Lap:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.shortFormationLap}
								disabled={formLoading}
								name="shortFormationLap"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>

				<!-- Formation Lap Type -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Formation Lap Type:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.formationLapType}
								disabled={formLoading}
								name="formationLapType"
								class="form form-select"
							>
								<option value={0}>Old Limiter Lap</option>
								<option value={1}
									>Free (replaces /manual start), only usable for private servers</option
								>
								<option value={3}>Default formation lap with position control and UI</option>
							</select>
						</div>
					</label>
				</div>

				<!-- Ignore Premature Disconnects -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Ignore Premature Disconnects:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.ignorePrematureDisconnects}
								disabled={formLoading}
								name="ignorePrematureDisconnects"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
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
