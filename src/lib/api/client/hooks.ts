'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

async function fetchFromAPI(endpoint: string, method: string = 'GET', body?: unknown) {
	const response = await fetch(endpoint, {
		method,
		headers: {
			'Content-Type': 'application/json'
		},
		body: body ? JSON.stringify(body) : undefined
	});

	if (!response.ok) {
		throw new Error(`API Error: ${response.statusText}`);
	}

	return response.json();
}

export function useServerStatus(serverId: string) {
	return useQuery({
		queryKey: ['server-status', serverId],
		queryFn: () => fetchFromAPI(`/api/server/${serverId}/status`),
		refetchInterval: 30000
	});
}

export function useServerAction(serverId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ action }: { action: 'start' | 'stop' | 'restart' }) =>
			fetchFromAPI(`/api/server/${serverId}/action`, 'POST', { action }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['server-status', serverId] });
			queryClient.invalidateQueries({ queryKey: ['servers'] });
		}
	});
}

export function useUsers(params?: Record<string, string>) {
	const searchParams = new URLSearchParams(params).toString();
	const endpoint = `/api/membership${searchParams ? `?${searchParams}` : ''}`;

	return useQuery({
		queryKey: ['users', params],
		queryFn: () => fetchFromAPI(endpoint)
	});
}

export function useCreateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userData: { username: string; password: string; role: string }) =>
			fetchFromAPI('/api/membership', 'POST', userData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		}
	});
}

export function useDeleteUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userId: string) => fetchFromAPI(`/api/membership/${userId}`, 'DELETE'),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		}
	});
}
