<script lang="ts">
	import { enhance } from '$app/forms';
	import { configFile, type ServerSettings } from '$models/config';

	const { config, id }: { config: ServerSettings; id: string } = $props();
	const editedConfig = $state({ ...config });
	let formLoading = $state(false);
	let restart = $state(true);
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
	class="space-y-6 max-w-3xl"
>
	<input type="hidden" name="id" value={id} />
	<input type="hidden" name="file" value={configFile.settings} />
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Server Name -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Server Name:
				<input
					bind:value={editedConfig.serverName}
					disabled={formLoading}
					name="serverName"
					type="text"
					class="form form-input"
				/>
			</label>
		</div>

		<!-- Admin Password -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Admin Password:
				<input
					bind:value={editedConfig.adminPassword}
					disabled={formLoading}
					name="adminPassword"
					type="password"
					class="form form-input"
				/>
			</label>
		</div>

		<!-- Car Group -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Car Group:
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
			</label>
		</div>

		<!-- Track Medals Requirement -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Track Medals Requirement:
				<input
					bind:value={editedConfig.trackMedalsRequirement}
					disabled={formLoading}
					name="trackMedalsRequirement"
					type="number"
					class="form form-input"
				/>
			</label>
		</div>

		<!-- Safety Rating Requirement -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Safety Rating Requirement:
				<input
					bind:value={editedConfig.safetyRatingRequirement}
					disabled={formLoading}
					name="safetyRatingRequirement"
					type="number"
					class="form form-input"
				/>
			</label>
		</div>

		<!-- Racecraft Rating Requirement -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Racecraft Rating Requirement:
				<input
					bind:value={editedConfig.racecraftRatingRequirement}
					disabled={formLoading}
					name="racecraftRatingRequirement"
					type="number"
					class="form form-input"
				/>
			</label>
		</div>

		<!-- Password -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Password:
				<input
					bind:value={editedConfig.password}
					disabled={formLoading}
					name="password"
					type="password"
					class="form form-input"
				/>
			</label>
		</div>

		<!-- Spectator Password -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Spectator Password:
				<input
					bind:value={editedConfig.spectatorPassword}
					disabled={formLoading}
					name="spectatorPassword"
					type="password"
					class="form form-input"
				/>
			</label>
		</div>

		<!-- Max Car Slots -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Max Car Slots:
				<input
					bind:value={editedConfig.maxCarSlots}
					disabled={formLoading}
					name="maxCarSlots"
					type="number"
					class="form form-input"
				/>
			</label>
		</div>

		<!-- Dump Leaderboards -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Dump Leaderboards:
				<select
					bind:value={editedConfig.dumpLeaderboards}
					disabled={formLoading}
					name="dumpLeaderboards"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>

		<!-- Is Race Locked -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Is Race Locked:
				<select
					bind:value={editedConfig.isRaceLocked}
					disabled={formLoading}
					name="isRaceLocked"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>

		<!-- Randomize Track When Empty -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Randomize Track When Empty:
				<select
					bind:value={editedConfig.randomizeTrackWhenEmpty}
					disabled={formLoading}
					name="randomizeTrackWhenEmpty"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>

		<!-- Central Entry List Path -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Central Entry List Path:
				<input
					bind:value={editedConfig.centralEntryListPath}
					disabled={formLoading}
					name="centralEntryListPath"
					type="text"
					class="form form-input"
				/>
			</label>
		</div>

		<!-- Allow Auto DQ -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Allow Auto DQ:
				<select
					bind:value={editedConfig.allowAutoDQ}
					disabled={formLoading}
					name="allowAutoDQ"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>

		<!-- Short Formation Lap -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Short Formation Lap:
				<select
					bind:value={editedConfig.shortFormationLap}
					disabled={formLoading}
					name="shortFormationLap"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>

		<!-- Formation Lap Type -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Formation Lap Type:
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
			</label>
		</div>

		<!-- Ignore Premature Disconnects -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Ignore Premature Disconnects:
				<select
					bind:value={editedConfig.ignorePrematureDisconnects}
					disabled={formLoading}
					name="ignorePrematureDisconnects"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
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
