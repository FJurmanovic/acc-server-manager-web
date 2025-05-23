<script lang="ts">
	import { enhance } from '$app/forms';
	import { configFile, type AssistRules } from '$models/config';

	const { config, id }: { config: AssistRules; id: string } = $props();
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
	<input type="hidden" name="file" value={configFile.assistRules} />
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Stability Control Level Max -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Stability Control Level Max:
				<input
					bind:value={editedConfig.stabilityControlLevelMax}
					disabled={formLoading}
					name="stabilityControlLevelMax"
					type="number"
					class="form form-input"
				/>
			</label>
		</div>

		<!-- Disable Autosteer -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Disable Autosteer:
				<select
					bind:value={editedConfig.disableAutosteer}
					disabled={formLoading}
					name="disableAutosteer"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>

		<!-- Disable Auto Lights -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Disable Auto Lights:
				<select
					bind:value={editedConfig.disableAutoLights}
					disabled={formLoading}
					name="disableAutoLights"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>

		<!-- Disable Auto Wiper -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Disable Auto Wiper:
				<select
					bind:value={editedConfig.disableAutoWiper}
					disabled={formLoading}
					name="disableAutoWiper"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>

		<!-- Disable Auto Engine Start -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Disable Auto Engine Start:
				<select
					bind:value={editedConfig.disableAutoEngineStart}
					disabled={formLoading}
					name="disableAutoEngineStart"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>

		<!-- Disable Auto Pit Limiter -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Disable Auto Pit Limiter:
				<select
					bind:value={editedConfig.disableAutoPitLimiter}
					disabled={formLoading}
					name="disableAutoPitLimiter"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>

		<!-- Disable Auto Gear -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Disable Auto Gear:
				<select
					bind:value={editedConfig.disableAutoGear}
					disabled={formLoading}
					name="disableAutoGear"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>

		<!-- Disable Auto Clutch -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Disable Auto Clutch:
				<select
					bind:value={editedConfig.disableAutoClutch}
					disabled={formLoading}
					name="disableAutoClutch"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>

		<!-- Disable Ideal Line -->
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
				Disable Ideal Line:
				<select
					bind:value={editedConfig.disableIdealLine}
					disabled={formLoading}
					name="disableIdealLine"
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
