'use server';

import { redirect } from 'next/navigation';
import { loginUser } from '@/lib/api/server/auth';
import { login, logout } from '@/lib/auth/server';

export type LoginResult = {
	success: boolean;
	message: string;
};

export async function loginAction(prevState: LoginResult, formData: FormData) {
	try {
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;

		if (!username || !password) {
			return {
				success: false,
				message: 'Username and password are required'
			};
		}

		const result = await loginUser(username, password);

		if (result.token && result.user) {
			await login(result.token, result.user);
		} else {
			return {
				success: false,
				message: 'Invalid credentials'
			};
		}
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Authentication failed'
		};
	}

	redirect('/dashboard');
}

export async function logoutAction() {
	await logout();
	redirect('/login');
}
