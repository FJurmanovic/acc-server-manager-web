<script lang="ts">
	import { enhance } from '$app/forms';
	import { authStore } from '$stores/authStore';
	import { get } from 'svelte/store';

	let username = $state('');
	let password = $state('');
	let formLoading = $state(false);
	let { error } = get(authStore);
</script>

<svelte:head>
	<title>ACC Server Manager - Login</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-900">
	<div class="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
		<div class="text-center">
			<h1 class="text-3xl font-bold text-white">ACC Server Manager</h1>
			<p class="mt-2 text-gray-400">Sign in to manage your servers</p>
		</div>
		{#if error}
		<div class="p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-sm">
			{error}
		</div>
		{/if}
		<form
			method="POST"
			action="?/login"
			use:enhance={() => {
				formLoading = true;
			}}
		>
		<div class="space-y-4">
			<div>
			<label for="username" class="block text-sm font-medium text-gray-300">Username</label>
			<input 
				type="text"
				name="username"
				id="username"
				autocomplete="username"
				required
				bind:value={username}
				disabled={formLoading}
				class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
			/>
			</div>
			
			<div>
			<label for="password" class="block text-sm font-medium text-gray-300">Password</label>
			<input 
				type="password"
				name="password"
				id="password"
				autocomplete="current-password"
				required
				bind:value={password}
				disabled={formLoading}
				class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
			/>
			</div>
		</div>

		<div>
			<button 
				type="submit" 
				disabled={formLoading}
				class="w-full flex justify-center mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
			>
			{#if formLoading}
				<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				Signing in...
			{:else}
				Sign in
			{/if}
			</button>
		</div>
		</form>
	</div>
</div>

<style>
	.error {
		color: red;
	}
</style>
