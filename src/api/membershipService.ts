import { fetchAPIEvent } from '$api/apiService';
import type { User } from '$models/user';
import type { RequestEvent } from '@sveltejs/kit';

export interface MembershipFilter {
	username?: string;
	role_name?: string;
	role_id?: string;
	page?: number;
	page_size?: number;
	sort_by?: string;
	sort_desc?: boolean;
}

export interface PaginatedUsers {
	users: User[];
	pagination: {
		page: number;
		page_size: number;
		total: number;
		total_pages: number;
	};
}

export interface CreateUserRequest {
	username: string;
	password: string;
	role: string;
}

export interface UpdateUserRequest {
	username?: string;
	password?: string;
	roleId?: string;
}

export interface Role {
	id: string;
	name: string;
}

export const membershipService = {
	async getUsers(event: RequestEvent, filter?: MembershipFilter): Promise<User[]> {
		const queryParams = new URLSearchParams();

		if (filter) {
			if (filter.username) queryParams.append('username', filter.username);
			if (filter.role_name) queryParams.append('role_name', filter.role_name);
			if (filter.role_id) queryParams.append('role_id', filter.role_id);
			if (filter.page) queryParams.append('page', filter.page.toString());
			if (filter.page_size) queryParams.append('page_size', filter.page_size.toString());
			if (filter.sort_by) queryParams.append('sort_by', filter.sort_by);
			if (filter.sort_desc !== undefined)
				queryParams.append('sort_desc', filter.sort_desc.toString());
		}

		const endpoint = `/membership${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
		return await fetchAPIEvent(event, endpoint);
	},

	async getUsersPaginated(event: RequestEvent, filter?: MembershipFilter): Promise<PaginatedUsers> {
		const users = await this.getUsers(event, filter);

		const page = filter?.page || 1;
		const pageSize = filter?.page_size || 10;
		const startIndex = (page - 1) * pageSize;
		const endIndex = startIndex + pageSize;

		const paginatedUsers = users.slice(startIndex, endIndex);
		const totalPages = Math.ceil(users.length / pageSize);

		return {
			users: paginatedUsers,
			pagination: {
				page,
				page_size: pageSize,
				total: users.length,
				total_pages: totalPages
			}
		};
	},

	async getUser(event: RequestEvent, userId: string): Promise<User> {
		return await fetchAPIEvent(event, `/membership/${userId}`);
	},

	async createUser(event: RequestEvent, userData: CreateUserRequest): Promise<User> {
		return await fetchAPIEvent(event, '/membership', 'POST', userData);
	},

	async updateUser(
		event: RequestEvent,
		userId: string,
		userData: UpdateUserRequest
	): Promise<User> {
		return await fetchAPIEvent(event, `/membership/${userId}`, 'PUT', userData);
	},

	async deleteUser(event: RequestEvent, userId: string): Promise<void> {
		await fetchAPIEvent(event, `/membership/${userId}`, 'DELETE');
	},

	async getRoles(event: RequestEvent): Promise<Role[]> {
		return await fetchAPIEvent(event, '/membership/roles');
	}
};

// Client-side service for browser usage (not currently used)
export const membershipClientService = {
	async getUsers(filter?: MembershipFilter): Promise<User[]> {
		const queryParams = new URLSearchParams();

		if (filter) {
			if (filter.username) queryParams.append('username', filter.username);
			if (filter.role_name) queryParams.append('role_name', filter.role_name);
			if (filter.role_id) queryParams.append('role_id', filter.role_id);
			if (filter.page) queryParams.append('page', filter.page.toString());
			if (filter.page_size) queryParams.append('page_size', filter.page_size.toString());
			if (filter.sort_by) queryParams.append('sort_by', filter.sort_by);
			if (filter.sort_desc !== undefined)
				queryParams.append('sort_desc', filter.sort_desc.toString());
		}

		const endpoint = `/membership${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
		const response = await fetch(endpoint);

		if (!response.ok) {
			throw new Error(`Failed to fetch users: ${response.statusText}`);
		}

		return response.json();
	},

	async createUser(userData: CreateUserRequest): Promise<User> {
		const response = await fetch('/membership', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userData)
		});

		if (!response.ok) {
			throw new Error(`Failed to create user: ${response.statusText}`);
		}

		return response.json();
	},

	async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
		const response = await fetch(`/membership/${userId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userData)
		});

		if (!response.ok) {
			throw new Error(`Failed to update user: ${response.statusText}`);
		}

		return response.json();
	},

	async deleteUser(userId: string): Promise<void> {
		const response = await fetch(`/membership/${userId}`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			throw new Error(`Failed to delete user: ${response.statusText}`);
		}
	},

	async getRoles(): Promise<Role[]> {
		const response = await fetch('/membership/roles');

		if (!response.ok) {
			throw new Error(`Failed to fetch roles: ${response.statusText}`);
		}

		return response.json();
	}
};
