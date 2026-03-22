const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

export type HealthStatus = { healthy: true; version: string } | { healthy: false; version: null };

export async function checkHealth(): Promise<HealthStatus> {
	try {
		const response = await fetch(`${BASE_URL}/system/health`, {
			method: 'GET',
			next: { revalidate: 0 }
		});
		if (!response.ok) return { healthy: false, version: null };
		const version = await response.text();
		return { healthy: true, version: version.trim() || 'unknown' };
	} catch {
		return { healthy: false, version: null };
	}
}
