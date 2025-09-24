'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth/server';
import { createUser, deleteUser } from '@/lib/api/server/membership';
import { userCreateSchema } from '../schemas';

export async function createUserAction(formData: FormData) {
	try {
		const session = await requireAuth();
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;
		const role = formData.get('role') as string;

		const rawData = { username, password, role };
		const data = userCreateSchema.safeParse(rawData);
		if (!data.success) {
			return { success: false, message: data.error.message };
		}

		await createUser(session.token!, data.data);
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
