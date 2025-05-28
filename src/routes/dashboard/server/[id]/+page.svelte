<script lang="ts">
	import EditorAssistRules from '$components/EditorAssistRules.svelte';
	import EditorConfiguration from '$components/EditorConfiguration.svelte';
	import EditorEvent from '$components/EditorEvent.svelte';
	import EditorEventRules from '$components/EditorEventRules.svelte';
	import EditorSettings from '$components/EditorSettings.svelte';
	import { getStatusColor } from '$lib/types/serviceStatus.js';
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

<div class="flex min-h-screen bg-gray-900 text-white">
	<!-- Sidebar -->
	<aside class="w-64 flex-shrink-0 border-r border-gray-700 bg-gray-800">
		<!-- Update the sidebar header to make the server name clickable -->
		<div class="border-b border-gray-700 p-4">
			<a href="/dashboard" class="transition-colors hover:text-green-400">
				<h2 class="truncate text-lg font-semibold">{server.name}</h2>
			</a>
			<div class="mt-1 flex items-center">
				<span class={`inline-block h-2 w-2 rounded-full ${getStatusColor(server.status)} mr-2`}
				></span>
				<span class="text-sm capitalize">{server.status}</span>
			</div>
		</div>

		<nav class="p-2">
			<ul class="space-y-1">
				<li>
					<button
						class={`w-full rounded-md px-3 py-2 text-left ${tab === configFile.event ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
						disabled={tab === configFile.event || !configs.event}
						onclick={() => (tab = configFile.event)}
					>
						Event
					</button>
				</li>
				<li>
					<button
						class={`w-full rounded-md px-3 py-2 text-left ${tab === configFile.configuration ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
						disabled={tab === configFile.configuration || !configs.configuration}
						onclick={() => (tab = configFile.configuration)}
					>
						Configuration
					</button>
				</li>
				<li>
					<button
						class={`w-full rounded-md px-3 py-2 text-left ${tab === configFile.settings ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
						disabled={tab === configFile.settings || !configs.settings}
						onclick={() => (tab = configFile.settings)}
					>
						Settings
					</button>
				</li>
				{#if configs.assistRules}
					<li>
						<button
							class={`w-full rounded-md px-3 py-2 text-left ${tab === configFile.assistRules ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
							disabled={tab === configFile.assistRules || !configs.assistRules}
							onclick={() => (tab = configFile.assistRules)}
						>
							Assist Rules
						</button>
					</li>
				{/if}
				{#if configs.eventRules}
					<li>
						<button
							class={`w-full rounded-md px-3 py-2 text-left ${tab === configFile.eventRules ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
							disabled={tab === configFile.eventRules || !configs.eventRules}
							onclick={() => (tab = configFile.eventRules)}
						>
							Event Rules
						</button>
					</li>
				{/if}
			</ul>
		</nav>
	</aside>

	<main class="flex-1 overflow-auto">
		<header class="flex items-center justify-between bg-gray-800 p-4 shadow-md">
			<h1 class="text-xl font-semibold">
				{#if tab === configFile.event}
					Event
				{:else if tab === configFile.configuration}
					Configuration
				{:else if tab === configFile.settings}
					Settings
				{:else if tab === configFile.assistRules}
					Assist Rules
				{:else if tab === configFile.eventRules}
					Event Rules
				{/if}
			</h1>
			<div class="flex space-x-3">
				<a
					href="/dashboard"
					class="flex items-center rounded-md bg-gray-700 px-3 py-1.5 text-sm hover:bg-gray-600"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-1 h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					Back to Dashboard
				</a>
				<a
					href="/logout"
					class="flex items-center rounded-md bg-red-700 px-3 py-1.5 text-sm hover:bg-red-800"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-1 h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						/>
					</svg>
					Logout
				</a>
			</div>
		</header>
		<div class="p-6">
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
			{:else}
				<div class="rounded-lg bg-gray-800 p-6 text-center">
					<p class="text-gray-400">Select a section from the sidebar to edit settings</p>
				</div>
			{/if}
		</div>
	</main>
</div>
