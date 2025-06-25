<script lang="ts">
	import '../app.css';
	import { user } from '$stores/user';
	import type { LayoutData } from './$types';

	let { data, children } = $props<LayoutData>();

	// Set the user store with data from the server
	$effect(() => {
		$user = data.user;
	});
</script>

<div class="layout">
	{@render children()}
</div>

<svelte:head>
	<title>ACC Server Manager</title>
</svelte:head>

<style></style>
