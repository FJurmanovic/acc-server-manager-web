<script lang="ts">
	import ServerCard from '$components/ServerCard.svelte';
	import Toast from '$components/Toast.svelte';
	import type { Server } from '$models/server';
	import { user, hasPermission } from '$stores/user';

	const { data, form } = $props();
	let servers: Server[] = data.servers;
</script>

{#if form?.message}
	<Toast message={form.message} type={form.success ? 'success' : 'error'} />
{/if}

<div class="min-h-screen bg-gray-900 text-white">
	<header class="bg-gray-800 shadow-md">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
			<h1 class="text-2xl font-bold">ACC Server Manager</h1>
			<div class="flex items-center space-x-4">
				{#if false && hasPermission($user, 'membership.view')}
					<a href="/dashboard/membership" class="flex items-center text-gray-300 hover:text-white">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 01-3-1.197"
							/>
						</svg>
						<span class="ml-1 hidden sm:inline">Users</span>
					</a>
				{/if}
				<a href="/logout">
					<button class="flex items-center text-gray-300 hover:text-white">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
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
						<span class="ml-1 hidden sm:inline">Logout</span>
					</button>
				</a>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-6 flex items-center justify-between">
			<h2 class="text-xl font-semibold">Your Servers</h2>
			<div class="flex space-x-2">
				<button
					onclick={() => {
						window.location.reload();
					}}
					class="rounded-md bg-gray-700 px-3 py-1 text-sm hover:bg-gray-600"
				>
					Refresh
				</button>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
</style>
