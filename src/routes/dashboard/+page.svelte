<script lang="ts">
	import ServerCard from '$components/ServerCard.svelte';
	import type { Server } from '$models/server';

	const { data } = $props();
	let servers: Server[] = data.servers;
</script>

<div class="server-grid">
	{#each servers as server}
		<ServerCard {server} />
	{/each}
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
