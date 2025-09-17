'use server';

import { redirect } from 'next/navigation';
import { loginUser, getOpenToken } from '@/lib/api/server/auth';
import { login } from '@/lib/auth/server';

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
			const openToken = await getOpenToken(result.token);
			await login(result.token, result.user, openToken);
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
	redirect('/logout');
}
