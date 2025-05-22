<script lang="ts">
	import type { Server } from '$models/server';

	let { server }: { server: Server } = $props();

	function getStatusColor(status: string) {
		switch (status) {
		case 'SERVICE_RUNNING\r\n': return 'bg-green-500';
		case 'SERVICE_STOPPED\r\n': return 'bg-red-500';
		case 'SERVICE_RESTARTING\r\n': return 'bg-yellow-500';
		default: return 'bg-gray-500';
		}
	}
</script>

<div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
	<a
		href={`dashboard/server/${server.id}`}
	>
		<div class="p-4">
			<div class="flex justify-between items-start">
			<div>
				<h3 class="text-lg font-medium">{server.name}</h3>
				<div class="flex items-center mt-1">
				<span class={`inline-block w-2 h-2 rounded-full ${getStatusColor(server.status)} mr-2`}></span>
				<span class="text-sm capitalize">{server.status}</span>
				</div>
			</div>
			<button 
				class="text-gray-400 hover:text-white"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
				</svg>
			</button>
			</div>
			
			<div class="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-300">
			<div>
				<span class="text-gray-500">Track:</span> {server.track}
			</div>
			<div>
				<span class="text-gray-500">Class:</span> {server.carClass}
			</div>
			<div>
				<span class="text-gray-500">Players:</span> {server.players}
			</div>
			<div>
				<span class="text-gray-500">Uptime:</span> {server.uptime}
			</div>
			</div>
		</div>
	</a>
	
	<form method="POST" action="?/start">
		<div class="bg-gray-900 px-4 py-3 flex justify-between">
			<input type="hidden" name="id" value={server.id} />
			<button 
				type="submit"
				disabled={server.status.startsWith('SERVICE_RUNNING')}
				onclick={(e) => e.stopPropagation()}
				class="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
			>
			Start
			</button>
			<button 
				disabled={server.status.startsWith('SERVICE_STOPPED')}
				onclick={(e) => e.stopPropagation()}
				class="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-md text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
				formaction="?/restart"
			>
			Restart
			</button>
			<button 
				disabled={server.status.startsWith('SERVICE_STOPPED')}
				onclick={(e) => e.stopPropagation()}
				class="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
				formaction="?/stop"
			>
			Stop
			</button>
		</div>	
	</form>
</div>

<style>
</style>
