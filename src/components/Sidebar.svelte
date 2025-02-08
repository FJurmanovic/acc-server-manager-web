<script>
	import { logout } from '$api/authService';
	import { goto } from '$app/navigation';

	function handleLogout() {
		logout();
		goto('/login');
	}
</script>

<aside
	class="fixed top-0 left-0 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0"
>
	<div class="h-full overflow-y-auto bg-gray-50 px-3 py-4 dark:bg-gray-800">
		<ul class="space-y-2 font-medium">
			<li>
				<a
					href="/dashboard"
					class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
				>
					<svg
						class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 22 21"
					>
						<path
							d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"
						/>
						<path
							d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"
						/>
					</svg>
					<span class="ms-3">Dashboard</span>
				</a>
			</li>
			<li>
				<a
					href="#"
					onclick={handleLogout}
					class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
				>
					<span class="ms-3">Logout</span>
				</a>
			</li>
		</ul>
	</div>
</aside>

<style>
</style>
