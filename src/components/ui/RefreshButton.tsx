'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function RefreshButton() {
	const router = useRouter();
	return (
		<Button variant="ghost" size="sm" onClick={() => router.refresh()}>
			Refresh
		</Button>
	);
}
