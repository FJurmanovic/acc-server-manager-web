'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth/server';
import { createUser, deleteUser } from '@/lib/api/server/membership';

export async function createUserAction(formData: FormData) {
	try {
		const session = await requireAuth();
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;
		const role = formData.get('role') as string;

		await createUser(session.token!, { username, password, role });
		revalidatePath('/dashboard/membership');

		return { success: true, message: 'User created successfully' };
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to create user'
		};
	}
}

export async function deleteUserAction(formData: FormData) {
	try {
		const session = await requireAuth();
		const userId = formData.get('id') as string;

		await deleteUser(session.token!, userId);
		revalidatePath('/dashboard/membership');

		return { success: true, message: 'User deleted successfully' };
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to delete user'
		};
	}
}
