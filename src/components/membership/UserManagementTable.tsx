'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Role, User } from '@/lib/types';
import { hasPermission } from '@/lib/types/user';
import { CreateUserModal } from './CreateUserModal';
import { DeleteUserModal } from './DeleteUserModal';

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
		if (sortBy !== field) return '↕️';
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
			<header className="bg-gray-800 shadow-md">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex items-center space-x-4">
						<Link href="/dashboard" className="text-gray-300 hover:text-white">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
						</Link>
						<h1 className="text-2xl font-bold">User Management</h1>
					</div>
					{hasPermission(currentUser, 'membership.create') && (
						<button
							onClick={openCreateModal}
							className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-green-700"
						>
							Create User
						</button>
					)}
				</div>
			</header>

			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Filters */}
				<div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
					<h2 className="mb-3 text-lg font-semibold">Filters</h2>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div>
							<label htmlFor="username" className="block text-sm font-medium text-gray-300">
								Username
							</label>
							<input
								id="username"
								type="text"
								value={usernameFilter}
								onChange={(e) => setUsernameFilter(e.target.value)}
								placeholder="Search by username..."
								className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
							/>
						</div>
						<div>
							<label htmlFor="role" className="block text-sm font-medium text-gray-300">
								Role
							</label>
							<input
								id="role"
								type="text"
								value={roleNameFilter}
								onChange={(e) => setRoleNameFilter(e.target.value)}
								placeholder="Filter by role..."
								className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
							/>
						</div>
					</div>
					<div className="mt-4 flex space-x-2">
						<button
							onClick={applyFilters}
							className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-700"
						>
							Apply Filters
						</button>
						<button
							onClick={resetFilters}
							className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-700"
						>
							Reset
						</button>
					</div>
				</div>

				{/* Results Summary */}
				<div className="mb-4 text-sm text-gray-400">Showing {initialData.length} users</div>

				{/* Users Table */}
				<div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
					<table className="min-w-full divide-y divide-gray-700">
						<thead className="bg-gray-900">
							<tr>
								<th className="px-6 py-3 text-left">
									<button
										className="flex items-center space-x-1 text-xs font-medium tracking-wider text-gray-400 uppercase transition-colors hover:text-white"
										onClick={() => handleSort('username')}
									>
										<span>Username</span>
										<span>{getSortIcon('username')}</span>
									</button>
								</th>
								<th className="px-6 py-3 text-left">
									<button
										className="flex items-center space-x-1 text-xs font-medium tracking-wider text-gray-400 uppercase transition-colors hover:text-white"
										onClick={() => handleSort('role')}
									>
										<span>Role</span>
										<span>{getSortIcon('role')}</span>
									</button>
								</th>
								{hasPermission(currentUser, 'membership.edit') && (
									<th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
										Actions
									</th>
								)}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-700 bg-gray-800">
							{initialData.length > 0 ? (
								initialData.map((user) => (
									<tr key={user.id} className="transition-colors hover:bg-gray-700">
										<td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-white">
											{user.username}
										</td>
										<td className="px-6 py-4 text-sm whitespace-nowrap">
											<span className="inline-flex rounded-full bg-blue-900 px-2 py-1 text-xs font-semibold text-blue-300">
												{user.role.name}
											</span>
										</td>
										{hasPermission(currentUser, 'membership.edit') && (
											<td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
												<div className="flex space-x-2">
													<button className="text-blue-400 transition-colors hover:text-blue-300">
														Edit
													</button>
													{hasPermission(currentUser, 'membership.delete') && (
														<button
															onClick={() => openDeleteModal(user)}
															className="text-red-400 transition-colors hover:text-red-300"
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
									<td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-400">
										No users found
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</main>

			{/* Modals */}
			{showCreateModal && <CreateUserModal roles={roles} onClose={closeCreateModal} />}

			{showDeleteModal && selectedUser && (
				<DeleteUserModal user={selectedUser} onClose={closeDeleteModal} />
			)}
		</>
	);
}
