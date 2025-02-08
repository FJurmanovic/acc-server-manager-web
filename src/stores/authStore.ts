import { writable } from 'svelte/store';

export const authStore = writable<{
	username?: string;
	password?: string;
	token?: string;
	error?: string;
}>({
	username: undefined,
	password: undefined,
	token: undefined,
	error: undefined
});
