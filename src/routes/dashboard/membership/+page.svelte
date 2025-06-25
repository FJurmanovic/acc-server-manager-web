<script lang="ts">
	import { user, hasPermission } from '$stores/user';
	import type { PageData } from './$types';

	export let data: PageData;

	$: users = data.users || [];
</script>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4">User Management</h1>

	{#if hasPermission($user, 'membership.create')}
	<div class="flex justify-end mb-4">
		<button class="btn btn-primary">Create User</button>
	</div>
{/if}

	<div class="overflow-x-auto">
		<table class="table w-full">
			<thead>
				<tr>
					<th>Username</th>
					<th>Role</th>
					{#if hasPermission($user, 'membership.edit')}
					<th>Actions</th>
				{/if}
				</tr>
			</thead>
			<tbody>
				{#each users as user (user.id)}
					<tr>
						<td>{user.username}</td>
						<td>{user.role.name}</td>
						{#if hasPermission($user, 'membership.edit')}
						<td>
							<button class="btn btn-sm">Edit</button>
							<button class="btn btn-sm btn-error">Delete</button>
						</td>
					{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
