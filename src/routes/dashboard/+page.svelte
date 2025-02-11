<script lang="ts">
	import ServerCard from '$components/ServerCard.svelte';
	import type { Server } from '$models/server';

	const { data } = $props();
	let servers: Server[] = data.servers;
</script>

<h1>Dashboard</h1>
<div class="server-grid">
	{#each servers as server}
		<ServerCard {server} />
	{/each}
</div>

<style>
	.server-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 20px;
	}
</style>
