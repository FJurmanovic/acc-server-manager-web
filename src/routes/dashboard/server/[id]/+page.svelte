<script lang="ts">
	import ConfigEditor from '$components/ConfigEditor.svelte';

	let { data } = $props();
	const config = data.config;
	const tracks = data.tracks;
	const id = data.id;
</script>

<h1>Edit</h1>
<ConfigEditor {config} {tracks} {id} />
