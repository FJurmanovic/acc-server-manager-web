'use client';

export default function RefreshButton() {
	return (
		<button
			onClick={() => window.location.reload()}
			className="rounded-md bg-gray-700 px-3 py-1 text-sm hover:bg-gray-600"
		>
			Refresh
		</button>
	);
}
