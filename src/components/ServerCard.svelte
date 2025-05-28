<script lang="ts">
	import type { Server } from '$models/server';
	import { getStatusColor, ServiceStatus } from '$lib/types/serviceStatus';

	let { server }: { server: Server } = $props();
</script>

<div class="overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-lg">
	<a href={`dashboard/server/${server.id}`}>
		<div class="p-4">
			<div class="flex items-start justify-between">
				<div>
					<h3 class="text-lg font-medium">{server.name}</h3>
					<div class="mt-1 flex items-center">
						<span class={`inline-block h-2 w-2 rounded-full ${getStatusColor(server.status)} mr-2`}
						></span>
						<span class="text-sm capitalize">{server.status}</span>
					</div>
				</div>
				<button class="text-gray-400 hover:text-white">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
						/>
					</svg>
				</button>
			</div>

			<div class="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-300">
				<div>
					<span class="text-gray-500">Track:</span>
					{server.state.track}
				</div>
				<div>
					<span class="text-gray-500">Players:</span>
					{server.state.playerCount}
				</div>
			</div>
		</div>
	</a>

	<form method="POST" action="?/start">
		<div class="flex justify-between bg-gray-900 px-4 py-3">
			<input type="hidden" name="id" value={server.id} />
			<button
				type="submit"
				disabled={server.status === ServiceStatus.Running}
				onclick={(e) => e.stopPropagation()}
				class="rounded-md bg-green-600 px-3 py-1 text-xs font-medium hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Start
			</button>
			<button
				disabled={server.status === ServiceStatus.Stopped}
				onclick={(e) => e.stopPropagation()}
				class="rounded-md bg-yellow-600 px-3 py-1 text-xs font-medium hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
				formaction="?/restart"
			>
				Restart
			</button>
			<button
				disabled={server.status === ServiceStatus.Stopped}
				onclick={(e) => e.stopPropagation()}
				class="rounded-md bg-red-600 px-3 py-1 text-xs font-medium hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
				formaction="?/stop"
			>
				Stop
			</button>
		</div>
	</form>
</div>

<style>
</style>
