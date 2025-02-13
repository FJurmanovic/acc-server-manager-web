<script lang="ts">
	import { enhance } from '$app/forms';
	import type { AssistRules } from '$models/config';

	const { config, id }: { config: AssistRules; id: string } = $props();
	const editedConfig = $state({ ...config });
	let formLoading = $state(false);
</script>

<form
	method="POST"
	action="?/assistRules"
	use:enhance={() => {
		formLoading = true;
	}}
>
	<input type="hidden" name="id" value={id} />
	<div class="sm:mx-auto sm:w-full sm:max-w-7xl">
		<div class="border-b border-gray-900/10 pb-12">
			<h2 class="text-base/7 font-semibold text-gray-900">Assist Rules</h2>
			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<!-- Stability Control Level Max -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Stability Control Level Max:
						<div class="mt-2">
							<div class="input-block">
								<input
									bind:value={editedConfig.stabilityControlLevelMax}
									disabled={formLoading}
									name="stabilityControlLevelMax"
									type="number"
									class="form form-input"
								/>
							</div>
						</div>
					</label>
				</div>

				<!-- Disable Autosteer -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Disable Autosteer:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.disableAutosteer}
								disabled={formLoading}
								name="disableAutosteer"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>

				<!-- Disable Auto Lights -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Disable Auto Lights:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.disableAutoLights}
								disabled={formLoading}
								name="disableAutoLights"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>

				<!-- Disable Auto Wiper -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Disable Auto Wiper:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.disableAutoWiper}
								disabled={formLoading}
								name="disableAutoWiper"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>

				<!-- Disable Auto Engine Start -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Disable Auto Engine Start:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.disableAutoEngineStart}
								disabled={formLoading}
								name="disableAutoEngineStart"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>

				<!-- Disable Auto Pit Limiter -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Disable Auto Pit Limiter:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.disableAutoPitLimiter}
								disabled={formLoading}
								name="disableAutoPitLimiter"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>

				<!-- Disable Auto Gear -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Disable Auto Gear:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.disableAutoGear}
								disabled={formLoading}
								name="disableAutoGear"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>

				<!-- Disable Auto Clutch -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Disable Auto Clutch:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.disableAutoClutch}
								disabled={formLoading}
								name="disableAutoClutch"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>

				<!-- Disable Ideal Line -->
				<div class="sm:col-span-6">
					<label class="block text-sm/6 font-medium text-gray-900">
						Disable Ideal Line:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.disableIdealLine}
								disabled={formLoading}
								name="disableIdealLine"
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
