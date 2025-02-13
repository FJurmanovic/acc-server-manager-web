<script>
	import '../app.css';
	let { children } = $props();
</script>

<div class="layout">
	{@render children()}
</div>

<svelte:head>
	<title>ACC Server Manager</title>
</svelte:head>

<style></style>
