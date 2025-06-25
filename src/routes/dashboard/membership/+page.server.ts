import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, fetch }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const response = await fetch('/api/users');
	if (!response.ok) {
		return { users: [] };
	}

	const users = await response.json();

	return {
		users
	};
};
