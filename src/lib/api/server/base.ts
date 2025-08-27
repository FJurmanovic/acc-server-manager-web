const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

export async function fetchServerAPI<T>(
	endpoint: string,
	token: string,
	method: string = 'GET',
	body?: object
): Promise<T> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`
	};

	const response = await fetch(`${BASE_URL}${endpoint}`, {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined
	});

	if (!response.ok) {
		throw new Error(
			`API Error: ${response.statusText} - ${method} - ${BASE_URL}${endpoint} - ${token}`
		);
	}

	if (response.headers.get('Content-Type')?.includes('application/json')) {
		return response.json();
	}

	return response.text() as T;
}
