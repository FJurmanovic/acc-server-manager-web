import { requireAuth } from '@/lib/auth/server';
import { getUsers, getRoles } from '@/lib/api/server/membership';
import type { UserListParams } from '@/lib/api/server/membership';
import { UserManagementTable } from '@/components/membership/UserManagementTable';

interface MembershipPageProps {
	searchParams: {
		username?: string;
		role_name?: string;
		sort_by?: string;
		sort_desc?: string;
		page?: string;
	};
}

export default async function MembershipPage({ searchParams }: MembershipPageProps) {
	const session = await requireAuth();

	const params: UserListParams = {
		username: searchParams.username,
		role_name: searchParams.role_name,
		sort_by: searchParams.sort_by || 'username',
		sort_desc: searchParams.sort_desc === 'true',
		page: parseInt(searchParams.page || '1'),
		limit: 20
	};

	const [userListData, roles] = await Promise.all([
		getUsers(session.token!, params),
		getRoles(session.token!)
	]);

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<UserManagementTable initialData={userListData} roles={roles} currentUser={session.user!} />
		</div>
	);
}
