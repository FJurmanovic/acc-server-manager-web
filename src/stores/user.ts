import { writable, type Writable } from 'svelte/store';
import type { User } from '$models/user';

export const user: Writable<User | null> = writable(null);

export function hasPermission(user: User | null, permission: string): boolean {
	if (!user || !user.role || !user.role.permissions) {
		return false;
	}
	// Super Admins have all permissions
	if (user.role.name === 'Super Admin') {
		return true;
	}
	return user.role.permissions.some((p) => p.name === permission);
}
