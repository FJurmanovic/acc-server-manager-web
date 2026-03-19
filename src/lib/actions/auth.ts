'use server';

import { redirect } from 'next/navigation';
import { loginUser, getOpenToken } from '@/lib/api/server/auth';
import { login, logout } from '@/lib/auth/server';
import { loginSchema, loginResponseSchema } from '../schemas';

export type LoginResult = {
	success: boolean;
	message: string;
};

export async function loginAction(prevState: LoginResult, formData: FormData) {
	try {
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;

		const loginData = loginSchema.safeParse({ username, password });
		if (!loginData.success) {
			return {
				success: false,
				message: loginData.error.message
			};
		}

		const result = loginResponseSchema.safeParse(await loginUser(loginData.data));

		if (result.success) {
			const openToken = await getOpenToken(result.data.token);
			await login(result.data.token, result.data.user, openToken);
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
}

export async function clearExpiredSessionAction() {
	await logout();
}
