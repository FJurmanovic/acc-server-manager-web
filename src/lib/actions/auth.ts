'use server';

import { redirect } from 'next/navigation';
import { loginUser } from '@/lib/api/server/auth';
import { login, logout } from '@/lib/auth/server';

export async function loginAction(formData: FormData) {
	try {
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;

		if (!username || !password) {
			throw new Error('Username and password are required');
		}

		const result = await loginUser(username, password);

		if (result.token && result.user) {
			await login(result.token, result.user);
		} else {
			throw new Error('Invalid credentials');
		}
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : 'Authentication failed');
	}

	redirect('/dashboard');
}

export async function logoutAction() {
	await logout();
	redirect('/login');
}
