'use client';

import { logoutAction } from '@/lib/actions/auth';
import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';

export default function LogoutButton() {
	const [, formAction] = useActionState(logoutAction, null);
	return (
		<form action={formAction}>
			<Button type="submit" variant="ghost" size="sm" className="flex items-center gap-1">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
					/>
				</svg>
				<span className="hidden sm:inline">Logout</span>
			</Button>
		</form>
	);
}
