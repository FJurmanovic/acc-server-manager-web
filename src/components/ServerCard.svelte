<script>
	let { server } = $props();
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
					class="mx-2 inline-flex items-center rounded-lg bg-blue-700 px-4 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					disabled={server.status.startsWith('SERVICE_RUNNING')}
					onclick={(e) => e.stopPropagation()}
					type="submit">Start</button
				>
				<button
					class="mx-2 inline-flex items-center rounded-lg bg-blue-700 px-4 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					disabled={server.status.startsWith('SERVICE_STOPPED')}
					onclick={(e) => e.stopPropagation()}
					formaction="?/stop">Stop</button
				>
				<button
					class="mx-2 inline-flex items-center rounded-lg bg-blue-700 px-4 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
