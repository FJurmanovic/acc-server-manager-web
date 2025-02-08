import fetchAPI from '$api/apiService';
import { authStore } from '$stores/authStore';

export const login = async (username: string, password: string) => {
	const token = btoa(`${username}:${password}`);
	authStore.set({ token });
	if (!(await checkAuth())) {
		{
			authStore.set({ token: undefined, error: 'Invalid username or password.' });
			return false;
		}
	}
	return true;
};

export const logout = () => {
	authStore.set({ token: undefined });
};

export const checkAuth = async () => {
	try {
		await fetchAPI('/api');
		return true;
	} catch (err) {
		return false;
	}
};
