import * as z from 'zod';

export const permissionSchema = z.object({
	id: z.uuid(),
	name: z.string()
});

export type Permission = z.infer<typeof permissionSchema>;

export const roleSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	permissions: z.array(permissionSchema)
});

export type Role = z.infer<typeof roleSchema>;

export const userSchema = z.object({
	id: z.uuid(),
	username: z.string(),
	role_id: z.uuid(),
	role: roleSchema
});

export type User = z.infer<typeof userSchema>;

export const userCreateSchema = z.object({
	username: z
		.string()
		.min(1, 'Username is required')
		.max(50, 'Username must be at most 50 characters'),
	password: z
		.string()
		.min(6, 'Password must be at least 6 characters')
		.max(100, 'Password must be at most 100 characters'),
	role: z.string().min(1, 'Role is required')
});

export type UserCreate = z.infer<typeof userCreateSchema>;

export const loginSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	password: z.string().min(1, 'Password is required')
});

export type Login = z.infer<typeof loginSchema>;

export const loginTokenSchema = z.object({
	token: z.string().min(1)
});

export type LoginTokenResponse = z.infer<typeof loginTokenSchema>;

export const loginResponseSchema = loginTokenSchema.extend({
	user: userSchema
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export function hasPermission(user: User | null, permission: string): boolean {
	if (!user || !user.role || !user.role.permissions) {
		return false;
	}

	if (user.role.name === 'Super Admin') {
		return true;
	}
	return user.role.permissions.some((p) => p.name === permission);
}
