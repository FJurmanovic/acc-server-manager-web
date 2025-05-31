<script lang="ts">
	import { enhance } from '$app/forms';
	import { configFile, type Configuration } from '$models/config';

	const { config, id }: { config: Configuration; id: string } = $props();
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
	<input type="hidden" name="file" value={configFile.configuration} />
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div>
			<label class="mb-1 block text-sm font-medium text-gray-300">
				UDP Port:
				<input
					disabled={formLoading}
					name="udpPort"
					type="number"
					class="form form-input"
					bind:value={editedConfig.udpPort}
				/>
			</label>
		</div>
		<div>
			<label class="mb-1 block text-sm font-medium text-gray-300">
				TCP Port:
				<input
					disabled={formLoading}
					name="tcpPort"
					type="number"
					class="form form-input"
					bind:value={editedConfig.tcpPort}
				/>
			</label>
		</div>
		<div>
			<label class="mb-1 block text-sm font-medium text-gray-300">
				Max Connections:
				<input
					disabled={formLoading}
					name="maxConnections"
					type="number"
					class="form form-input"
					bind:value={editedConfig.maxConnections}
				/>
			</label>
		</div>
		<div>
			<label class="mb-1 block text-sm font-medium text-gray-300">
				Lan Discovery:
				<select
					bind:value={editedConfig.lanDiscovery}
					disabled={formLoading}
					name="lanDiscovery"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>
		<div>
			<label class="mb-1 block text-sm font-medium text-gray-300">
				Register To Lobby:
				<select
					bind:value={editedConfig.registerToLobby}
					disabled={formLoading}
					name="registerToLobby"
					class="form form-select"
				>
					<option value={0}>No</option>
					<option value={1}>Yes</option>
				</select>
			</label>
		</div>
		<input type="hidden" name="configVersion" value={1} />
	</div>
	<div class="border-t border-gray-700 pt-4">
		<label class="flex items-center">
			<input
				type="checkbox"
				name="restart"
				bind:checked={restart}
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
