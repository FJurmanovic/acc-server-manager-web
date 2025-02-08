<script>
	import Sidebar from '$components/Sidebar.svelte';
	import '../../app.css';
	let { children } = $props();
</script>

<div class="layout">
	<Sidebar />
	<div class="p-4 sm:ml-64">
		{@render children()}
	</div>
</div>

<style></style>
