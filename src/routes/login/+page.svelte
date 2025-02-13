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

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
			Sign in to your account
		</h2>
	</div>
	{#if error}
		<div class="sm:mx-auto sm:w-full sm:max-w-sm">
			<p class="error">{error}</p>
		</div>
	{/if}

	<form
		method="POST"
		action="?/login"
		use:enhance={() => {
			formLoading = true;
		}}
	>
		<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<div class="space-y-6">
				<div>
					<label for="text" class="block text-sm/6 font-medium text-gray-900">Username</label>
					<div class="mt-2">
						<input
							type="text"
							name="username"
							id="username"
							autocomplete="username"
							required
							class="form form-login"
							bind:value={username}
							disabled={formLoading}
						/>
					</div>
				</div>

				<div>
					<div class="flex items-center justify-between">
						<label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
					</div>
					<div class="mt-2">
						<input
							type="password"
							name="password"
							id="password"
							autocomplete="current-password"
							required
							class="form form-login"
							bind:value={password}
							disabled={formLoading}
						/>
					</div>
				</div>

				<div>
					<button type="submit" class="btn btn-login" disabled={formLoading}>Sign in</button>
				</div>
			</div>
		</div>
	</form>
</div>

<style>
	.error {
		color: red;
	}
</style>
