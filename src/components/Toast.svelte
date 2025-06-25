<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let { message = '', type = 'success', duration = 5000 } = $props();

	let visible = $state(true);

	let timer: number;

	onMount(() => {
		timer = window.setTimeout(() => {
			visible = false;
		}, duration);
	});

	onDestroy(() => {
		clearTimeout(timer);
	});

	const baseClasses =
		'fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white transition-all duration-500 ease-in-out transform';
	const typeClasses = {
		success: 'bg-green-600',
		error: 'bg-red-600'
	};
	const visibilityClasses = visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5';
</script>

{#if visible}
	<div class="{baseClasses} {typeClasses[type]} {visibilityClasses}" role="alert">
		<p>{message}</p>
	</div>
{/if}
