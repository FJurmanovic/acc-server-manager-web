export interface Permission {
	id: string;
	name: string;
}

export interface Role {
	id: string;
	name: string;
	permissions: Permission[];
}

export interface User {
	id: string;
	username: string;
	role_id: string;
	role: Role;
}

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
