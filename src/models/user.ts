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
