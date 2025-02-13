<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Configuration } from '$models/config';

	const { config, id }: { config: Configuration; id: string } = $props();
	const editedConfig = $state({ ...config });
	let formLoading = $state(false);
</script>

<form
	method="POST"
	action="?/configuration"
	use:enhance={() => {
		formLoading = true;
	}}
>
	<input type="hidden" name="id" value={id} />
	<div class="sm:mx-auto sm:w-full sm:max-w-7xl">
		<div class="border-b border-gray-900/10 pb-12">
			<h2 class="text-base/7 font-semibold text-gray-900">Configuration</h2>
			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<div class="sm:col-span-2">
					<label class="block text-sm/6 font-medium text-gray-900">
						UDP Port:
						<div class="mt-2">
							<div class="input-block">
								<input
									disabled={formLoading}
									name="udpPort"
									type="number"
									class="form form-input"
									bind:value={editedConfig.udpPort}
								/>
							</div>
						</div></label
					>
				</div>
				<div class="sm:col-span-2">
					<label class="block text-sm/6 font-medium text-gray-900">
						TCP Port:
						<div class="mt-2">
							<div class="input-block">
								<input
									disabled={formLoading}
									name="tcpPort"
									type="number"
									class="form form-input"
									bind:value={editedConfig.tcpPort}
								/>
							</div>
						</div></label
					>
				</div>
				<div class="sm:col-span-2">
					<label class="block text-sm/6 font-medium text-gray-900">
						Max Connections:
						<div class="mt-2">
							<div class="input-block">
								<input
									disabled={formLoading}
									name="maxConnections"
									type="number"
									class="form form-input"
									bind:value={editedConfig.maxConnections}
								/>
							</div>
						</div></label
					>
				</div>
				<div class="sm:col-span-2">
					<label class="block text-sm/6 font-medium text-gray-900">
						Lan Discovery:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.lanDiscovery}
								disabled={formLoading}
								name="lanDiscovery"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>
				<div class="sm:col-span-2">
					<label class="block text-sm/6 font-medium text-gray-900">
						Register To Lobby:
						<div class="mt-2 grid grid-cols-1">
							<select
								bind:value={editedConfig.registerToLobby}
								disabled={formLoading}
								name="registerToLobby"
								class="form form-select"
							>
								<option value={0}>No</option>
								<option value={1}>Yes</option>
							</select>
						</div>
					</label>
				</div>
				<input type="hidden" name="configVersion" value={1} />
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
