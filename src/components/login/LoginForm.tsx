'use client';

import { clearExpiredSessionAction, loginAction, LoginResult } from '@/lib/actions/auth';
import { use, useActionState, useEffect } from 'react';

const initialState: LoginResult = {
	message: '',
	success: true
};

export default function LoginForm({
	searchParams
}: {
	searchParams: Promise<{ expired: boolean | undefined }>;
}) {
	const params = use(searchParams);
	const expired = params.expired;

	useEffect(() => {
		if (expired) {
			clearExpiredSessionAction();
		}
	}, [expired]);
	const [state, formAction] = useActionState(loginAction, initialState);
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
			<div className="w-full max-w-md space-y-8 rounded-lg bg-gray-800 p-8 shadow-lg">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-white">ACC Server Manager</h1>
					<p className="mt-2 text-gray-400">Sign in to manage your servers</p>
				</div>
				{expired && (
					<div className="rounded-md border border-yellow-700 bg-yellow-900/50 p-3 text-sm text-yellow-200">
						Your session has expired. Please sign in again.
					</div>
				)}
				{state?.success ? null : (
					<div className="rounded-md border border-red-700 bg-red-900/50 p-3 text-sm text-red-200">
						{state?.message}
					</div>
				)}

				<form action={formAction} className="space-y-6">
					<div>
						<label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-300">
							Username
						</label>
						<input
							id="username"
							name="username"
							type="text"
							autoComplete="username"
							required
							className="form-input w-full"
						/>
					</div>

					<div>
						<label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							required
							className="form-input w-full"
						/>
					</div>

					<button
						type="submit"
						className="w-full rounded-md bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
					>
						Sign in
					</button>
				</form>
			</div>
		</div>
	);
}
