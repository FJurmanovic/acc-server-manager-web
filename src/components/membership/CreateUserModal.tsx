'use client';

import { useState } from 'react';
import type { Role } from '@/lib/schemas';
import { createUserAction } from '@/lib/actions/membership';
import { Button } from '@/components/ui/Button';

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
			<div className="w-full max-w-md rounded-lg border border-border bg-canvas p-6 shadow-xl">
				<h2 className="mb-4 text-base font-semibold text-primary">Create New User</h2>

				{error && (
					<div className="mb-4 rounded-md border border-red/20 bg-red-bg p-3 text-sm text-red">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							htmlFor="create-username"
							className="mb-1.5 block text-sm font-medium text-secondary"
						>
							Username
						</label>
						<input
							id="create-username"
							type="text"
							value={formData.username}
							onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
							required
							disabled={isSubmitting}
							className="form-input"
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="create-password"
							className="mb-1.5 block text-sm font-medium text-secondary"
						>
							Password
						</label>
						<input
							id="create-password"
							type="password"
							value={formData.password}
							onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
							required
							disabled={isSubmitting}
							className="form-input"
						/>
					</div>

					<div className="mb-6">
						<label
							htmlFor="create-role"
							className="mb-1.5 block text-sm font-medium text-secondary"
						>
							Role
						</label>
						<select
							id="create-role"
							value={formData.role}
							onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
							required
							disabled={isSubmitting}
							className="form-input"
						>
							<option value="">Select a role...</option>
							{roles.map((role) => (
								<option key={role.id} value={role.name}>
									{role.name}
								</option>
							))}
						</select>
					</div>

					<div className="flex justify-end gap-2">
						<Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
							Cancel
						</Button>
						<Button type="submit" variant="primary" disabled={isSubmitting}>
							{isSubmitting ? 'Creating...' : 'Create User'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
