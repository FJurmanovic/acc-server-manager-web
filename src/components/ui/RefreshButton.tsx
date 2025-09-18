'use client';

import { useRouter } from 'next/navigation';

export default function RefreshButton() {
	const router = useRouter();
	return (
		<button
			onClick={() => router.refresh()}
			className="rounded-md bg-gray-700 px-3 py-1 text-sm hover:bg-gray-600"
		>
			Refresh
		</button>
	);
}
