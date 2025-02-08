<script lang="ts">
	import ServerCard from '$components/ServerCard.svelte';
	import { invalidateAll } from '$app/navigation';

	const { data } = $props();
	let servers: Array<Object> = data.servers;

	const refresh = async () => {
		invalidateAll();
	};
</script>

<h1>Dashboard</h1>
<div class="server-grid">
	{#each servers as server}
		<ServerCard {refresh} {server} />
	{/each}
</div>

<style>
	.server-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 20px;
	}
</style>
