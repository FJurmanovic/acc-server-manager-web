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
		<div className="flex min-h-screen items-center justify-center bg-base px-4">
			<div className="w-full max-w-md space-y-6 rounded-lg border border-border bg-canvas p-8 shadow-xl">
				<div className="text-center">
					<h1 className="text-xl font-bold text-primary">ACC Server Manager</h1>
					<p className="mt-1 text-sm text-muted">Sign in to manage your servers</p>
				</div>
				{expired && (
					<div className="rounded-md border border-yellow/30 bg-yellow-bg px-3 py-2 text-sm text-yellow">
						Your session has expired. Please sign in again.
					</div>
				)}
				{state?.success ? null : (
					<div className="rounded-md border border-red/30 bg-red-bg px-3 py-2 text-sm text-red">
						{state?.message}
					</div>
				)}

				<form action={formAction} className="space-y-4">
					<div>
						<label htmlFor="username" className="mb-1.5 block text-sm font-medium text-secondary">
							Username
						</label>
						<input
							id="username"
							name="username"
							type="text"
							autoComplete="username"
							required
							className="form-input"
						/>
					</div>

					<div>
						<label htmlFor="password" className="mb-1.5 block text-sm font-medium text-secondary">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							required
							className="form-input"
						/>
					</div>

					<button
						type="submit"
						className="w-full rounded-md bg-btn-green border border-btn-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-btn-green-hover focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 focus:ring-offset-base"
					>
						Sign in
					</button>
				</form>
			</div>
		</div>
	);
}
