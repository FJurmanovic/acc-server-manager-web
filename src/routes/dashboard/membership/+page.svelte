<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Pagination from '$components/Pagination.svelte';
	import Toast from '$components/Toast.svelte';
	import { user, hasPermission } from '$stores/user';
	import type { PageData } from './$types';

	const { data, form }: { data: PageData; form?: any } = $props();

	let users = $derived(data.users || []);
	let roles = $derived(data.roles || []);
	let pagination = $derived(data.pagination);
	let filter = $derived(data.filter);

	let usernameFilter = $state('');
	let roleNameFilter = $state('');
	let sortBy = $state('username');
	let sortDesc = $state(false);
	let showCreateModal = $state(false);
	let showDeleteModal = $state(false);
	let selectedUser: any = $state(null);
	let createForm = $state({
		username: '',
		password: '',
		role: ''
	});

	// Initialize filters from data
	$effect(() => {
		usernameFilter = filter.username || '';
		roleNameFilter = filter.role_name || '';
		sortBy = filter.sort_by || 'username';
		sortDesc = filter.sort_desc || false;
	});

	function applyFilters() {
		const params = new URLSearchParams();

		// Set filter parameters
		if (usernameFilter) params.set('username', usernameFilter);
		if (roleNameFilter) params.set('role_name', roleNameFilter);
		params.set('sort_by', sortBy);
		params.set('sort_desc', sortDesc.toString());
		params.set('page', '1'); // Reset to first page

		goto(`?${params.toString()}`, { invalidateAll: true });
	}

	function resetFilters() {
		usernameFilter = '';
		roleNameFilter = '';
		sortBy = 'username';
		sortDesc = false;
		goto('/dashboard/membership', { invalidateAll: true });
	}

	function handlePageChange(newPage: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', newPage.toString());
		goto(`?${params.toString()}`, { invalidateAll: true });
	}

	function handleSort(field: string) {
		if (sortBy === field) {
			sortDesc = !sortDesc;
		} else {
			sortBy = field;
			sortDesc = false;
		}
		applyFilters();
	}

	function getSortIcon(field: string) {
		if (sortBy !== field) return '↕️';
		return sortDesc ? '↓' : '↑';
	}

	function openCreateModal() {
		showCreateModal = true;
		createForm = { username: '', password: '', role: '' };
	}

	function closeCreateModal() {
		showCreateModal = false;
	}

	function openDeleteModal(userItem: any) {
		selectedUser = userItem;
		showDeleteModal = true;
	}

	function closeDeleteModal() {
		selectedUser = null;
		showDeleteModal = false;
	}

	// Close modals after successful form submission
	$effect(() => {
		if (form?.success) {
			showCreateModal = false;
			showDeleteModal = false;
		}
	});
</script>

{#if form?.message}
	<Toast message={form.message} type={form.success ? 'success' : 'error'} />
{/if}

<div class="min-h-screen bg-gray-900 text-white">
	<header class="bg-gray-800 shadow-md">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
			<div class="flex items-center space-x-4">
				<a href="/dashboard" class="text-gray-300 hover:text-white" aria-label="Back to dashboard">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
				</a>
				<h1 class="text-2xl font-bold">User Management</h1>
			</div>
			{#if hasPermission($user, 'membership.create')}
				<button
					onclick={openCreateModal}
					class="rounded-md bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-700"
				>
					Create User
				</button>
			{/if}
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Filters -->
		<div class="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
			<h2 class="mb-3 text-lg font-semibold">Filters</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div>
					<label for="username" class="block text-sm font-medium text-gray-300">Username</label>
					<input
						id="username"
						type="text"
						bind:value={usernameFilter}
						placeholder="Search by username..."
						class="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<div>
					<label for="role" class="block text-sm font-medium text-gray-300">Role</label>
					<input
						id="role"
						type="text"
						bind:value={roleNameFilter}
						placeholder="Filter by role..."
						class="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
			</div>
			<div class="mt-4 flex space-x-2">
				<button
					onclick={applyFilters}
					class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700"
				>
					Apply Filters
				</button>
				<button
					onclick={resetFilters}
					class="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-700"
				>
					Reset
				</button>
			</div>
		</div>

		<!-- Results Summary -->
		<div class="mb-4 text-sm text-gray-400">
			Showing {users.length} of {pagination.total} users
			{#if pagination.total_pages > 1}
				(Page {pagination.page} of {pagination.total_pages})
			{/if}
		</div>

		<!-- Users Table -->
		<div class="overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
			<table class="min-w-full divide-y divide-gray-700">
				<thead class="bg-gray-900">
					<tr>
						<th class="px-6 py-3 text-left">
							<button
								class="flex items-center space-x-1 text-xs font-medium tracking-wider text-gray-400 uppercase hover:text-white"
								onclick={() => handleSort('username')}
							>
								<span>Username</span>
								<span>{getSortIcon('username')}</span>
							</button>
						</th>
						<th class="px-6 py-3 text-left">
							<button
								class="flex items-center space-x-1 text-xs font-medium tracking-wider text-gray-400 uppercase hover:text-white"
								onclick={() => handleSort('role')}
							>
								<span>Role</span>
								<span>{getSortIcon('role')}</span>
							</button>
						</th>
						{#if hasPermission($user, 'membership.edit')}
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase"
							>
								Actions
							</th>
						{/if}
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-700 bg-gray-800">
					{#each users as userItem (userItem.id)}
						<tr class="hover:bg-gray-700">
							<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-white">
								{userItem.username}
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap">
								<span
									class="inline-flex rounded-full bg-blue-900 px-2 py-1 text-xs font-semibold text-blue-300"
								>
									{userItem.role.name}
								</span>
							</td>
							{#if hasPermission($user, 'membership.edit')}
								<td class="px-6 py-4 text-sm font-medium whitespace-nowrap">
									<div class="flex space-x-2">
										<button class="text-blue-400 hover:text-blue-300"> Edit </button>
										{#if hasPermission($user, 'membership.delete')}
											<button
												onclick={() => openDeleteModal(userItem)}
												class="text-red-400 hover:text-red-300"
											>
												Delete
											</button>
										{/if}
									</div>
								</td>
							{/if}
						</tr>
					{:else}
						<tr>
							<td colspan="3" class="px-6 py-4 text-center text-sm text-gray-400">
								No users found
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if pagination.total_pages > 1}
			<div class="mt-6 flex justify-center">
				<Pagination
					currentPage={pagination.page}
					totalPages={pagination.total_pages}
					onPageChange={handlePageChange}
				/>
			</div>
		{/if}
	</main>
</div>

<!-- Create User Modal -->
{#if showCreateModal}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
		<div class="w-full max-w-md rounded-lg bg-gray-800 p-6">
			<h3 class="mb-4 text-lg font-semibold text-white">Create New User</h3>
			<form method="POST" action="?/create">
				<div class="mb-4">
					<label for="create-username" class="block text-sm font-medium text-gray-300"
						>Username</label
					>
					<input
						id="create-username"
						name="username"
						type="text"
						bind:value={createForm.username}
						required
						class="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<div class="mb-4">
					<label for="create-password" class="block text-sm font-medium text-gray-300"
						>Password</label
					>
					<input
						id="create-password"
						name="password"
						type="password"
						bind:value={createForm.password}
						required
						class="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<div class="mb-6">
					<label for="create-role" class="block text-sm font-medium text-gray-300">Role</label>
					<select
						id="create-role"
						name="role"
						bind:value={createForm.role}
						required
						class="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					>
						<option value="">Select a role...</option>
						{#each roles as role}
							<option value={role.name}>{role.name}</option>
						{/each}
					</select>
				</div>
				<div class="flex justify-end space-x-2">
					<button
						type="button"
						onclick={closeCreateModal}
						class="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-700"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="rounded-md bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-700"
					>
						Create User
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && selectedUser}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
		<div class="w-full max-w-md rounded-lg bg-gray-800 p-6">
			<h3 class="mb-4 text-lg font-semibold text-white">Delete User</h3>
			<p class="mb-6 text-gray-300">
				Are you sure you want to delete the user "{selectedUser.username}"? This action cannot be
				undone.
			</p>
			<form method="POST" action="?/delete">
				<input type="hidden" name="id" value={selectedUser.id} />
				<div class="flex justify-end space-x-2">
					<button
						type="button"
						onclick={closeDeleteModal}
						class="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-700"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-700"
					>
						Delete User
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<svelte:head>
	<title>User Management - ACC Server Manager</title>
</svelte:head>
