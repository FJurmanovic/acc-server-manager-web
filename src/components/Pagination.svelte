<script lang="ts">
	export let currentPage: number = 1;
	export let totalPages: number = 1;
	export let onPageChange: (page: number) => void = () => {};

	$: pages = generatePageNumbers(currentPage, totalPages);

	function generatePageNumbers(current: number, total: number): (number | string)[] {
		if (total <= 7) {
			return Array.from({ length: total }, (_, i) => i + 1);
		}

		const pages: (number | string)[] = [];

		if (current <= 4) {
			// Show first 5 pages, then ellipsis, then last page
			pages.push(...[1, 2, 3, 4, 5]);
			if (total > 6) pages.push('...');
			pages.push(total);
		} else if (current >= total - 3) {
			// Show first page, ellipsis, then last 5 pages
			pages.push(1);
			if (total > 6) pages.push('...');
			pages.push(...[total - 4, total - 3, total - 2, total - 1, total]);
		} else {
			// Show first page, ellipsis, current and neighbors, ellipsis, last page
			pages.push(1, '...', current - 1, current, current + 1, '...', total);
		}

		return pages;
	}

	function handlePageClick(page: number | string) {
		if (typeof page === 'number' && page !== currentPage) {
			onPageChange(page);
		}
	}

	function handlePrevious() {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	}

	function handleNext() {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	}
</script>

<div class="flex items-center justify-center space-x-1">
	<!-- Previous button -->
	<button
		class="rounded-md px-3 py-2 text-sm font-medium transition-colors {currentPage === 1
			? 'cursor-not-allowed bg-gray-700 text-gray-500'
			: 'border border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'}"
		disabled={currentPage === 1}
		onclick={handlePrevious}
	>
		Previous
	</button>

	<!-- Page numbers -->
	{#each pages as page}
		{#if page === '...'}
			<span class="px-3 py-2 text-sm text-gray-500">...</span>
		{:else}
			<button
				class="rounded-md px-3 py-2 text-sm font-medium transition-colors {page === currentPage
					? 'bg-blue-600 text-white'
					: 'border border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'}"
				onclick={() => handlePageClick(page)}
			>
				{page}
			</button>
		{/if}
	{/each}

	<!-- Next button -->
	<button
		class="rounded-md px-3 py-2 text-sm font-medium transition-colors {currentPage === totalPages
			? 'cursor-not-allowed bg-gray-700 text-gray-500'
			: 'border border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'}"
		disabled={currentPage === totalPages}
		onclick={handleNext}
	>
		Next
	</button>
</div>

<!-- Page info -->
<div class="mt-2 text-center text-sm text-gray-400">
	Page {currentPage} of {totalPages}
</div>
