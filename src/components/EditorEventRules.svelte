<script lang="ts">
	import { enhance } from '$app/forms';
	import { configFile, type EventRules } from '$models/config';

	const { config, id }: { config: EventRules; id: string } = $props();
	const editedConfig = $state({ ...config });
	let formLoading = $state(false);
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
	<input type="hidden" name="file" value={configFile.eventRules} />
	<div class="sm:mx-auto sm:w-full sm:max-w-7xl">
		<div class="border-b border-gray-900/10 pb-12">
			<h2 class="text-base/7 font-semibold text-gray-900">Event Rules</h2>
			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<!-- Qualify Standing Type -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Qualify Standing Type:
						<div class="mt-2">
							<div class="input-block">
								<input
									bind:value={editedConfig.qualifyStandingType}
									disabled={formLoading}
									name="qualifyStandingType"
									type="number"
									class="form form-input"
								/>
							</div>
						</div>
					</label>
				</div>

				<!-- Pit Window Length Sec -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Pit Window Length (Sec):
						<div class="mt-2">
							<div class="input-block">
								<input
									bind:value={editedConfig.pitWindowLengthSec}
									disabled={formLoading}
									name="pitWindowLengthSec"
									type="number"
									class="form form-input"
								/>
							</div>
						</div>
					</label>
				</div>

				<!-- Driver Stint Time Sec -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Driver Stint Time (Sec):
						<div class="mt-2">
							<div class="input-block">
								<input
									bind:value={editedConfig.driverStintTimeSec}
									disabled={formLoading}
									name="driverStintTimeSec"
									type="number"
									class="form form-input"
								/>
							</div>
						</div>
					</label>
				</div>

				<!-- Mandatory Pitstop Count -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Mandatory Pitstop Count:
						<div class="mt-2">
							<div class="input-block">
								<input
									bind:value={editedConfig.mandatoryPitstopCount}
									disabled={formLoading}
									name="mandatoryPitstopCount"
									type="number"
									class="form form-input"
								/>
							</div>
						</div>
					</label>
				</div>

				<!-- Max Total Driving Time -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Max Total Driving Time:
						<div class="mt-2">
							<div class="input-block">
								<input
									bind:value={editedConfig.maxTotalDrivingTime}
									disabled={formLoading}
									name="maxTotalDrivingTime"
									type="number"
									class="form form-input"
								/>
							</div>
						</div>
					</label>
				</div>

				<!-- Is Refuelling Allowed In Race -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Is Refuelling Allowed In Race:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.isRefuellingAllowedInRace}
								disabled={formLoading}
								name="isRefuellingAllowedInRace"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>

				<!-- Is Refuelling Time Fixed -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Is Refuelling Time Fixed:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.isRefuellingTimeFixed}
								disabled={formLoading}
								name="isRefuellingTimeFixed"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>

				<!-- Is Mandatory Pitstop Refuelling Required -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Is Mandatory Pitstop Refuelling Required:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.isMandatoryPitstopRefuellingRequired}
								disabled={formLoading}
								name="isMandatoryPitstopRefuellingRequired"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>

				<!-- Is Mandatory Pitstop Tyre Change Required -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Is Mandatory Pitstop Tyre Change Required:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.isMandatoryPitstopTyreChangeRequired}
								disabled={formLoading}
								name="isMandatoryPitstopTyreChangeRequired"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>

				<!-- Is Mandatory Pitstop Swap Driver Required -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Is Mandatory Pitstop Swap Driver Required:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.isMandatoryPitstopSwapDriverRequired}
								disabled={formLoading}
								name="isMandatoryPitstopSwapDriverRequired"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>

				<!-- Tyre Set Count -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Tyre Set Count:
						<div class="mt-2">
							<div class="input-block">
								<input
									bind:value={editedConfig.tyreSetCount}
									disabled={formLoading}
									name="tyreSetCount"
									type="number"
									class="form form-input"
								/>
							</div>
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
