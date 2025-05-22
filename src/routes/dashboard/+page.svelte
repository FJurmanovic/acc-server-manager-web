<script lang="ts">
	import ServerCard from '$components/ServerCard.svelte';
	import type { Server } from '$models/server';

	const { data } = $props();
	let servers: Server[] = data.servers;
</script>

<div class="min-h-screen bg-gray-900 text-white">
  <header class="bg-gray-800 shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">ACC Server Manager</h1>
      <div class="flex items-center space-x-4">
		<a href="/logout">
			<button 
			class="text-gray-300 hover:text-white flex items-center"
			>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
			</svg>
			<span class="ml-1 hidden sm:inline">Logout</span>
			</button>
		</a>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">Your Servers</h2>
      <div class="flex space-x-2">
        <a href="/dashboard" class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-sm">
          Refresh
        </a>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
	{#each servers as server}
		<ServerCard {server} />
	{/each}
    </div>
  </main>
</div>

<svelte:head>
	<title>ACC Server Manager - Dashboard</title>
</svelte:head>

<style>
	.server-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 20px;
	}
</style>
