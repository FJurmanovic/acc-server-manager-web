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
	class="space-y-6 max-w-3xl"
>
	<input type="hidden" name="id" value={id} />
	<input type="hidden" name="file" value={configFile.configuration} />
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div>
			<label class="block text-sm font-medium text-gray-300 mb-1">
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
			<label class="block text-sm font-medium text-gray-300 mb-1">
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
			<label class="block text-sm font-medium text-gray-300 mb-1">
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
			<label class="block text-sm font-medium text-gray-300 mb-1">
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
			<label class="block text-sm font-medium text-gray-300 mb-1">
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
