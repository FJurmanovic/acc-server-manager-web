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
	class="max-w-3xl space-y-6"
>
	<input type="hidden" name="id" value={id} />
	<input type="hidden" name="file" value={configFile.assistRules} />
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Stability Control Level Max -->
		<div>
			<label class="mb-1 block text-sm font-medium text-gray-300">
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
			<label class="mb-1 block text-sm font-medium text-gray-300">
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
			<label class="mb-1 block text-sm font-medium text-gray-300">
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
			<label class="mb-1 block text-sm font-medium text-gray-300">
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
			<label class="mb-1 block text-sm font-medium text-gray-300">
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
			<label class="mb-1 block text-sm font-medium text-gray-300">
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
			<label class="mb-1 block text-sm font-medium text-gray-300">
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
			<label class="mb-1 block text-sm font-medium text-gray-300">
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
			<label class="mb-1 block text-sm font-medium text-gray-300">
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
	<div class="border-t border-gray-700 pt-4">
		<label class="flex items-center">
			<input
				type="checkbox"
				bind:checked={restart}
				name="restart"
				class="h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-600 focus:ring-green-500"
			/>
			<span class="ml-2 text-sm text-gray-300">Restart server after saving</span>
		</label>
	</div>

	<div class="flex justify-end">
		<button
			type="submit"
			disabled={formLoading}
			class="rounded-md bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-700"
		>
			Save Changes
		</button>
	</div>
</form>

<style></style>
