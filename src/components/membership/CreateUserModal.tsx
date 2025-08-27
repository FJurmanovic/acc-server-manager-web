'use client';

import { useState } from 'react';
import type { Role } from '@/lib/types';
import { createUserAction } from '@/lib/actions/membership';

interface CreateUserModalProps {
	roles: Role[];
	onClose: () => void;
}

export function CreateUserModal({ roles, onClose }: CreateUserModalProps) {
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		role: ''
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		const formDataObj = new FormData();
		formDataObj.append('username', formData.username);
		formDataObj.append('password', formData.password);
		formDataObj.append('role', formData.role);

		try {
			const result = await createUserAction(formDataObj);
			if (result.success) {
				onClose();
				window.location.reload(); // Refresh to show new user
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
				<h3 className="mb-4 text-lg font-semibold text-white">Create New User</h3>

				{error && (
					<div className="mb-4 rounded-md bg-red-900 p-3 text-sm text-red-300">{error}</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label htmlFor="create-username" className="block text-sm font-medium text-gray-300">
							Username
						</label>
						<input
							id="create-username"
							type="text"
							value={formData.username}
							onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
							required
							disabled={isSubmitting}
							className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
						/>
					</div>

					<div className="mb-4">
						<label htmlFor="create-password" className="block text-sm font-medium text-gray-300">
							Password
						</label>
						<input
							id="create-password"
							type="password"
							value={formData.password}
							onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
							required
							disabled={isSubmitting}
							className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
						/>
					</div>

					<div className="mb-6">
						<label htmlFor="create-role" className="block text-sm font-medium text-gray-300">
							Role
						</label>
						<select
							id="create-role"
							value={formData.role}
							onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
							required
							disabled={isSubmitting}
							className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
						>
							<option value="">Select a role...</option>
							{roles.map((role) => (
								<option key={role.id} value={role.name}>
									{role.name}
								</option>
							))}
						</select>
					</div>

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
							className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-green-700 disabled:opacity-50"
						>
							{isSubmitting ? 'Creating...' : 'Create User'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
