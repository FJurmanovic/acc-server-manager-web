interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
	const getVisiblePages = () => {
		const delta = 2;
		const range = [];

		for (
			let i = Math.max(2, currentPage - delta);
			i <= Math.min(totalPages - 1, currentPage + delta);
			i++
		) {
			range.push(i);
		}

		if (currentPage - delta > 2) {
			range.unshift('...');
		}
		if (currentPage + delta < totalPages - 1) {
			range.push('...');
		}

		range.unshift(1);
		if (totalPages !== 1) {
			range.push(totalPages);
		}

		return range;
	};

	return (
		<nav className="flex items-center justify-center space-x-2">
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Previous
			</button>

			<div className="flex space-x-1">
				{getVisiblePages().map((page, index) => (
					<button
						key={index}
						onClick={() => (typeof page === 'number' ? onPageChange(page) : undefined)}
						disabled={typeof page === 'string'}
						className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
							page === currentPage
								? 'bg-blue-600 text-white'
								: page === '...'
									? 'cursor-default text-gray-400'
									: 'bg-gray-700 text-white hover:bg-gray-600'
						} `}
					>
						{page}
					</button>
				))}
			</div>

			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Next
			</button>
		</nav>
	);
}
