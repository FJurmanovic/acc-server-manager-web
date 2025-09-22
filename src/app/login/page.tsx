import { Suspense } from 'react';
import LoginForm from '@/components/login/LoginForm';
export const dynamic = 'force-dynamic';

export default function LoginPage({
	searchParams
}: {
	searchParams: Promise<{ expired: boolean | undefined }>;
}) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<LoginForm searchParams={searchParams} />
		</Suspense>
	);
}
