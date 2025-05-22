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

	function getStatusColor(status: string) {
		console.log({status})
		switch (status) {
		case 'SERVICE_RUNNING\r\n': return 'bg-green-500';
		case 'SERVICE_STOPPED\r\n': return 'bg-red-500';
		case 'SERVICE_RESTARTING\r\n': return 'bg-yellow-500';
		default: return 'bg-gray-500';
		}
	}
</script>

<svelte:head>
	<title>{server.name}</title>
</svelte:head>

<div class="min-h-screen bg-gray-900 text-white flex">
  <!-- Sidebar -->
  <aside class="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0">
    <!-- Update the sidebar header to make the server name clickable -->
    <div class="p-4 border-b border-gray-700">
      <a href="/dashboard" class="hover:text-green-400 transition-colors">
        <h2 class="text-lg font-semibold truncate">{server.name}</h2>
      </a>
      <div class="flex items-center mt-1">
        <span class={`inline-block w-2 h-2 rounded-full ${getStatusColor(server.status)} mr-2`}></span>
        <span class="text-sm capitalize">{server.status}</span>
      </div>
    </div>
    
    <nav class="p-2">
      <ul class="space-y-1">
        <li>
          <button 
            class={`w-full text-left px-3 py-2 rounded-md ${tab === configFile.event ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
			disabled={tab === configFile.event || !configs.event}
			onclick={() => (tab = configFile.event)}
          >
            Event 
          </button>
        </li>
        <li>
          <button 
            class={`w-full text-left px-3 py-2 rounded-md ${tab === configFile.configuration ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
			disabled={tab === configFile.configuration || !configs.configuration}
			onclick={() => (tab = configFile.configuration)}
          >
            Configuration 
          </button>
        </li>
        <li>
          <button 
            class={`w-full text-left px-3 py-2 rounded-md ${tab === configFile.settings ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
			disabled={tab === configFile.settings || !configs.settings}
			onclick={() => (tab = configFile.settings)}
          >
            Settings 
          </button>
        </li>
		{#if configs.assistRules}
        <li>
          <button 
            class={`w-full text-left px-3 py-2 rounded-md ${tab === configFile.assistRules ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
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
            class={`w-full text-left px-3 py-2 rounded-md ${tab === configFile.eventRules ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
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
    <header class="bg-gray-800 shadow-md p-4 flex justify-between items-center">
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
          class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </a>
        <a 
          href="/logout" 
          class="px-3 py-1.5 bg-red-700 hover:bg-red-800 rounded-md text-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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
		<div class="bg-gray-800 rounded-lg p-6 text-center">
			<p class="text-gray-400">Select a section from the sidebar to edit settings</p>
		</div>
		{/if}
	</div>
</main>
</div>
