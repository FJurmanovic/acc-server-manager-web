<script lang="ts">
	import type { Server } from '$models/server';

	let { server }: { server: Server } = $props();
</script>

<a
	href={`dashboard/server/${server.id}`}
	class="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
>
	<div class="flex flex-col items-center pb-4">
		<h2 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{server.name}</h2>
		<p class="text-sm text-gray-500 dark:text-gray-400">Status: {server.status}</p>
		<div class="mt-12 flex">
			<form method="POST" action="?/start">
				<input type="hidden" name="id" value={server.id} />
				<button
					class="btn btn-blue"
					disabled={server.status.startsWith('SERVICE_RUNNING')}
					onclick={(e) => e.stopPropagation()}
					type="submit">Start</button
				>
				<button
					class="btn btn-blue"
					disabled={server.status.startsWith('SERVICE_STOPPED')}
					onclick={(e) => e.stopPropagation()}
					formaction="?/stop">Stop</button
				>
				<button
					class="btn btn-blue"
					disabled={server.status.startsWith('SERVICE_STOPPED')}
					onclick={(e) => e.stopPropagation()}
					formaction="?/restart">Restart</button
				>
			</form>
		</div>
	</div>
</a>

<style>
</style>
