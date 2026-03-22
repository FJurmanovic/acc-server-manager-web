import { Suspense } from 'react';
import LoginForm from '@/components/login/LoginForm';
import { checkHealth } from '@/lib/api/server/health';
export const dynamic = 'force-dynamic';

export default async function LoginPage({
	searchParams
}: {
	searchParams: Promise<{ expired: boolean | undefined }>;
}) {
	const health = await checkHealth();

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<LoginForm searchParams={searchParams} health={health} />
		</Suspense>
	);
}
