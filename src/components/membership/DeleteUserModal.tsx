'use client';

import { useState } from 'react';
import type { User } from '@/lib/types';
import { deleteUserAction } from '@/lib/actions/membership';

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
		<div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
			<div className="w-full max-w-md rounded-lg bg-gray-800 p-6">
				<h3 className="mb-4 text-lg font-semibold text-white">Delete User</h3>

				{error && (
					<div className="mb-4 rounded-md bg-red-900 p-3 text-sm text-red-300">{error}</div>
				)}

				<p className="mb-6 text-gray-300">
					Are you sure you want to delete the user &quot;{user.username}&quot;? This action cannot
					be undone.
				</p>

				<form onSubmit={handleSubmit}>
					<div className="flex justify-end space-x-2">
						<button
							type="button"
							onClick={onClose}
							disabled={isSubmitting}
							className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-700 disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-red-700 disabled:opacity-50"
						>
							{isSubmitting ? 'Deleting...' : 'Delete User'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
