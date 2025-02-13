<script lang="ts">
	import EditorAssistRules from '$components/EditorAssistRules.svelte';
	import EditorConfiguration from '$components/EditorConfiguration.svelte';
	import EditorEvent from '$components/EditorEvent.svelte';
	import EditorEventRules from '$components/EditorEventRules.svelte';
	import EditorSettings from '$components/EditorSettings.svelte';
	import { configFile } from '$models/config.js';

	let { data } = $props();
	const configs = data.configs;
	const tracks = data.tracks;
	const id = data.id;
	const server = data.server;
	let tab = $state(configFile.event);
</script>

<svelte:head>
	<title>{server.name}</title>
</svelte:head>

<aside class="fixed top-0 left-64 z-40 h-screen w-48">
	<div class="h-full overflow-y-auto bg-gray-50 px-1 py-4 dark:bg-gray-700">
		<div class="flex items-center justify-center">
			<h2 class="bold mb-5 text-gray-300">{server.name}</h2>
		</div>
		<ul class="space-y-2 font-medium">
			<li>
				<button
					class="btn btn-sidebar"
					disabled={tab === configFile.event || !configs.event}
					onclick={() => (tab = configFile.event)}
				>
					<span class="ms-3">Event</span>
				</button>
				<button
					class="btn btn-sidebar"
					disabled={tab === configFile.configuration || !configs.configuration}
					onclick={() => (tab = configFile.configuration)}
				>
					<span class="ms-3">Configuration</span>
				</button>
				<button
					class="btn btn-sidebar"
					disabled={tab === configFile.settings || !configs.settings}
					onclick={() => (tab = configFile.settings)}
				>
					<span class="ms-3">Settings</span>
				</button>
				{#if configs.assistRules}
					<button
						class="btn btn-sidebar"
						disabled={tab === configFile.assistRules}
						onclick={() => (tab = configFile.assistRules)}
					>
						<span class="ms-3">Assist Rules</span>
					</button>
				{/if}
				{#if configs.eventRules}
					<button
						class="btn btn-sidebar"
						disabled={tab === configFile.eventRules}
						onclick={() => (tab = configFile.eventRules)}
					>
						<span class="ms-3">Event Rules</span>
					</button>
				{/if}
			</li>
		</ul>
	</div>
</aside>
<div class="sm:ml-48">
	{#if tab === configFile.event}
		<EditorEvent config={configs.event} {tracks} {id} />
	{:else if tab === configFile.configuration}
		<EditorConfiguration config={configs.configuration} {id} />
	{:else if tab === configFile.settings}
		<EditorSettings config={configs.settings} {id} />
	{:else if tab === configFile.assistRules}
		<EditorAssistRules config={configs.assistRules} {id} />
	{:else if tab === configFile.eventRules}
		<EditorEventRules config={configs.eventRules} {id} />
	{/if}
</div>
