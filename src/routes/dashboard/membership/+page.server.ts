import { fail, redirect, type Actions } from '@sveltejs/kit';
import { membershipService } from '$api/membershipService';

export const load = async (event) => {
	if (!event.locals.user) {
		throw redirect(303, '/login');
	}

	// Get filter parameters from URL
	const page = parseInt(event.url.searchParams.get('page') || '1');
	const pageSize = parseInt(event.url.searchParams.get('page_size') || '10');
	const username = event.url.searchParams.get('username') || '';
	const roleName = event.url.searchParams.get('role_name') || '';
	const sortBy = event.url.searchParams.get('sort_by') || 'username';
	const sortDesc = event.url.searchParams.get('sort_desc') === 'true';

	const filter = {
		page,
		page_size: pageSize,
		username: username || undefined,
		role_name: roleName || undefined,
		sort_by: sortBy,
		sort_desc: sortDesc
	};

	try {
		const [users, roles] = await Promise.all([
			membershipService.getUsers(event, filter),
			membershipService.getRoles(event)
		]);
		// Simple client-side pagination
		const startIndex = (page - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		const paginatedUsers = users.slice(startIndex, endIndex);
		const totalPages = Math.ceil(users.length / pageSize);

		return {
			users: paginatedUsers,
			roles,
			pagination: {
				page,
				page_size: pageSize,
				total: users.length,
				total_pages: totalPages
			},
			filter: {
				username,
				role_name: roleName,
				sort_by: sortBy,
				sort_desc: sortDesc
			}
		};
	} catch (error) {
		console.error('Failed to load users or roles:', error);
		return {
			users: [],
			roles: [],
			pagination: {
				page: 1,
				page_size: 10,
				total: 0,
				total_pages: 0
			},
			filter: {
				username: '',
				role_name: '',
				sort_by: 'username',
				sort_desc: false
			}
		};
	}
};

export const actions = {
	create: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const role = formData.get('role');

		if (!username || !password || !role) {
			return fail(400, { message: 'All fields are required' });
		}

		try {
			await membershipService.createUser(event, {
				username: username.toString(),
				password: password.toString(),
				role: role.toString()
			});
			return { success: true, message: 'User created successfully' };
		} catch (error) {
			console.error('Failed to create user:', error);
			return fail(500, { message: 'Failed to create user' });
		}
	},

	delete: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id');

		if (!id) {
			return fail(400, { message: 'User ID is required' });
		}

		try {
			await membershipService.deleteUser(event, id.toString());
			return { success: true, message: 'User deleted successfully' };
		} catch (error) {
			console.error('Failed to delete user:', error);
			return fail(500, { message: 'Failed to delete user' });
		}
	}
} satisfies Actions;
