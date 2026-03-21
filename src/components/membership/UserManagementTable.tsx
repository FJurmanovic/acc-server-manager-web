'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Role, User } from '@/lib/schemas';
import { hasPermission } from '@/lib/schemas/user';
import { CreateUserModal } from './CreateUserModal';
import { DeleteUserModal } from './DeleteUserModal';
import { GhButton } from '@/components/ui/GhButton';

interface UserManagementTableProps {
	initialData: User[];
	roles: Role[];
	currentUser: User;
}

export function UserManagementTable({ initialData, roles, currentUser }: UserManagementTableProps) {
	const router = useRouter();
	const [usernameFilter, setUsernameFilter] = useState('');
	const [roleNameFilter, setRoleNameFilter] = useState('');
	const [sortBy, setSortBy] = useState('username');
	const [sortDesc, setSortDesc] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	const applyFilters = () => {
		const params = new URLSearchParams();

		if (usernameFilter) params.set('username', usernameFilter);
		if (roleNameFilter) params.set('role_name', roleNameFilter);
		params.set('sort_by', sortBy);
		params.set('sort_desc', sortDesc.toString());
		params.set('page', '1');

		router.push(`/dashboard/membership?${params.toString()}`);
	};

	const resetFilters = () => {
		setUsernameFilter('');
		setRoleNameFilter('');
		setSortBy('username');
		setSortDesc(false);
		router.push('/dashboard/membership');
	};

	const handleSort = (field: string) => {
		if (sortBy === field) {
			setSortDesc(!sortDesc);
		} else {
			setSortBy(field);
			setSortDesc(false);
		}
		applyFilters();
	};

	const getSortIcon = (field: string) => {
		if (sortBy !== field) return '↕';
		return sortDesc ? '↓' : '↑';
	};

	const openCreateModal = () => {
		setShowCreateModal(true);
	};

	const closeCreateModal = () => {
		setShowCreateModal(false);
	};

	const openDeleteModal = (user: User) => {
		setSelectedUser(user);
		setShowDeleteModal(true);
	};

	const closeDeleteModal = () => {
		setSelectedUser(null);
		setShowDeleteModal(false);
	};

	return (
		<>
			{/* Internal topbar */}
			<header className="flex h-12 items-center justify-between border-b border-gh-border-muted px-5">
				<div className="flex items-center gap-3">
					<span className="text-sm font-semibold text-gh-primary">User Management</span>
				</div>
				{hasPermission(currentUser, 'membership.create') && (
					<GhButton variant="primary" size="sm" onClick={openCreateModal}>
						+ Create User
					</GhButton>
				)}
			</header>

			{/* Filters */}
			<div className="mx-5 mt-4 rounded-lg border border-gh-border bg-gh-canvas p-4">
				<div className="mb-3 text-sm font-semibold text-gh-primary">Filters</div>
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
					<div>
						<label htmlFor="username" className="mb-1 block text-xs font-medium text-gh-muted">
							Username
						</label>
						<input
							id="username"
							type="text"
							value={usernameFilter}
							onChange={(e) => setUsernameFilter(e.target.value)}
							placeholder="Search by username..."
							className="form-input"
						/>
					</div>
					<div>
						<label htmlFor="role" className="mb-1 block text-xs font-medium text-gh-muted">
							Role
						</label>
						<input
							id="role"
							type="text"
							value={roleNameFilter}
							onChange={(e) => setRoleNameFilter(e.target.value)}
							placeholder="Filter by role..."
							className="form-input"
						/>
					</div>
				</div>
				<div className="mt-3 flex gap-2">
					<GhButton variant="primary" size="sm" onClick={applyFilters}>
						Apply
					</GhButton>
					<GhButton variant="ghost" size="sm" onClick={resetFilters}>
						Reset
					</GhButton>
				</div>
			</div>

			{/* Results count */}
			<div className="mx-5 mt-3 text-xs text-gh-muted">Showing {initialData.length} users</div>

			{/* Users table */}
			<div className="mx-5 mt-2 mb-5 overflow-hidden rounded-lg border border-gh-border bg-gh-canvas">
				<table className="min-w-full">
					<thead>
						<tr className="border-b border-gh-border-muted bg-gh-base">
							<th className="px-4 py-2 text-left">
								<button
									onClick={() => handleSort('username')}
									className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gh-subtle hover:text-gh-primary"
								>
									Username <span>{getSortIcon('username')}</span>
								</button>
							</th>
							<th className="px-4 py-2 text-left">
								<button
									onClick={() => handleSort('role')}
									className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gh-subtle hover:text-gh-primary"
								>
									Role <span>{getSortIcon('role')}</span>
								</button>
							</th>
							{hasPermission(currentUser, 'membership.edit') && (
								<th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gh-subtle">
									Actions
								</th>
							)}
						</tr>
					</thead>
					<tbody>
						{initialData.length > 0 ? (
							initialData.map((user) => (
								<tr
									key={user.id}
									className="border-b border-gh-border-muted transition-colors hover:bg-gh-hover last:border-0"
								>
									<td className="px-4 py-3 text-sm font-medium text-gh-primary">
										{user.username}
									</td>
									<td className="px-4 py-3">
										<span className="inline-flex rounded-full border border-gh-blue/20 bg-gh-blue-bg px-2 py-0.5 text-xs font-medium text-gh-blue">
											{user.role.name}
										</span>
									</td>
									{hasPermission(currentUser, 'membership.edit') && (
										<td className="px-4 py-3">
											<div className="flex gap-3">
												<button className="text-xs text-gh-blue hover:underline">
													Edit
												</button>
												{hasPermission(currentUser, 'membership.delete') && (
													<button
														onClick={() => openDeleteModal(user)}
														className="text-xs text-gh-red hover:underline"
													>
														Delete
													</button>
												)}
											</div>
										</td>
									)}
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={hasPermission(currentUser, 'membership.edit') ? 3 : 2}
									className="px-4 py-8 text-center text-sm text-gh-muted"
								>
									No users found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Modals */}
			{showCreateModal && <CreateUserModal roles={roles} onClose={closeCreateModal} />}

			{showDeleteModal && selectedUser && (
				<DeleteUserModal user={selectedUser} onClose={closeDeleteModal} />
			)}
		</>
	);
}
