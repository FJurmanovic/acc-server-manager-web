'use client';

import { useState } from 'react';
import type { User } from '@/lib/schemas';
import { deleteUserAction } from '@/lib/actions/membership';
import { GhButton } from '@/components/ui/GhButton';

interface DeleteUserModalProps {
	user: User;
	onClose: () => void;
}

export function DeleteUserModal({ user, onClose }: DeleteUserModalProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		const formDataObj = new FormData();
		formDataObj.append('id', user.id);

		try {
			const result = await deleteUserAction(formDataObj);
			if (result.success) {
				onClose();
				window.location.reload();
			} else {
				setError(result.message);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
			<div className="w-full max-w-md rounded-lg border border-gh-border bg-gh-canvas p-6 shadow-xl">
				<h2 className="mb-4 text-base font-semibold text-gh-primary">Delete User</h2>

				{error && (
					<div className="mb-4 rounded-md border border-gh-red/20 bg-gh-red-bg p-3 text-sm text-gh-red">
						{error}
					</div>
				)}

				<p className="mb-6 text-sm text-gh-secondary">
					Are you sure you want to delete the user &quot;{user.username}&quot;? This action cannot
					be undone.
				</p>

				<form onSubmit={handleSubmit}>
					<div className="flex justify-end gap-2">
						<GhButton type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
							Cancel
						</GhButton>
						<GhButton type="submit" variant="danger-solid" disabled={isSubmitting}>
							{isSubmitting ? 'Deleting...' : 'Delete User'}
						</GhButton>
					</div>
				</form>
			</div>
		</div>
	);
}
