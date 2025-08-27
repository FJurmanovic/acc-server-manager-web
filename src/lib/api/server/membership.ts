import { fetchServerAPI } from './base';
import { User, Role } from '@/lib/types';

export interface UserListParams {
	username?: string;
	role_name?: string;
	sort_by?: string;
	sort_desc?: boolean;
	page?: number;
	limit?: number;
}

const membershipRoute = '/membership';

export async function getUsers(token: string, params: UserListParams = {}): Promise<User[]> {
	const searchParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined) {
			searchParams.set(key, value.toString());
		}
	});

	const queryString = searchParams.toString();
	const endpoint = `${membershipRoute}${queryString ? `?${queryString}` : ''}`;

	return fetchServerAPI(endpoint, token);
}

export async function createUser(
	token: string,
	userData: { username: string; password: string; role: string }
) {
	return fetchServerAPI(membershipRoute, token, 'POST', userData);
}

export async function getUserById(token: string, userId: string): Promise<User> {
	return fetchServerAPI(`${membershipRoute}/${userId}`, token);
}

export async function updateUser(token: string, userId: string, userData: Partial<User>) {
	return fetchServerAPI(`${membershipRoute}/${userId}`, token, 'PUT', userData);
}

export async function deleteUser(token: string, userId: string) {
	return fetchServerAPI(`${membershipRoute}/${userId}`, token, 'DELETE');
}

export async function getRoles(token: string): Promise<Role[]> {
	return fetchServerAPI(`${membershipRoute}/roles`, token);
}
