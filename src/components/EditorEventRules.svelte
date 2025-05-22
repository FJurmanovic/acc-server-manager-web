<script lang="ts">
	import { enhance } from '$app/forms';
	import { configFile, type EventRules } from '$models/config';

	const { config, id }: { config: EventRules; id: string } = $props();
	const editedConfig = $state({ ...config });
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
	<input type="hidden" name="file" value={configFile.eventRules} />
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Qualify Standing Type -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Qualify Standing Type:
				<input
					bind:value={editedConfig.qualifyStandingType}
					disabled={formLoading}
					name="qualifyStandingType"
					type="number"
					class="form form-input"
				/>
			</label>
		</div>

		<!-- Pit Window Length Sec -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Pit Window Length (Sec):
				<input
					bind:value={editedConfig.pitWindowLengthSec}
					disabled={formLoading}
					name="pitWindowLengthSec"
					type="number"
					class="form form-input"
				/>
			</label>
		</div>

		<!-- Driver Stint Time Sec -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Driver Stint Time (Sec):
				<input
					bind:value={editedConfig.driverStintTimeSec}
					disabled={formLoading}
					name="driverStintTimeSec"
					type="number"
					class="form form-input"
				/>
			</label>
		</div>

		<!-- Mandatory Pitstop Count -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Mandatory Pitstop Count:
				<input
					bind:value={editedConfig.mandatoryPitstopCount}
					disabled={formLoading}
					name="mandatoryPitstopCount"
					type="number"
					class="form form-input"
				/>
			</label>
		</div>

		<!-- Max Total Driving Time -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Max Total Driving Time:
				<input
					bind:value={editedConfig.maxTotalDrivingTime}
					disabled={formLoading}
					name="maxTotalDrivingTime"
					type="number"
					class="form form-input"
				/>
			</label>
		</div>

		<!-- Is Refuelling Allowed In Race -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Is Refuelling Allowed In Race:
				<select
					bind:value={editedConfig.isRefuellingAllowedInRace}
					disabled={formLoading}
					name="isRefuellingAllowedInRace"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>

		<!-- Is Refuelling Time Fixed -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Is Refuelling Time Fixed:
				<select
					bind:value={editedConfig.isRefuellingTimeFixed}
					disabled={formLoading}
					name="isRefuellingTimeFixed"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>

		<!-- Is Mandatory Pitstop Refuelling Required -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Is Mandatory Pitstop Refuelling Required:
				<select
					bind:value={editedConfig.isMandatoryPitstopRefuellingRequired}
					disabled={formLoading}
					name="isMandatoryPitstopRefuellingRequired"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>

		<!-- Is Mandatory Pitstop Tyre Change Required -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Is Mandatory Pitstop Tyre Change Required:
				<select
					bind:value={editedConfig.isMandatoryPitstopTyreChangeRequired}
					disabled={formLoading}
					name="isMandatoryPitstopTyreChangeRequired"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>

		<!-- Is Mandatory Pitstop Swap Driver Required -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Is Mandatory Pitstop Swap Driver Required:
				<select
					bind:value={editedConfig.isMandatoryPitstopSwapDriverRequired}
					disabled={formLoading}
					name="isMandatoryPitstopSwapDriverRequired"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>

		<!-- Tyre Set Count -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Tyre Set Count:
				<input
					bind:value={editedConfig.tyreSetCount}
					disabled={formLoading}
					name="tyreSetCount"
					type="number"
					class="form form-input"
				/>
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
