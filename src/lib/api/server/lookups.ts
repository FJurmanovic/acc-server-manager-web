import { fetchServerAPI } from './base';
import { Track, CarModel, CupCategory, DriverCategory, SessionType } from '@/lib/types';

const lookupRoute = '/lookup';

export async function getTracks(token: string): Promise<Track[]> {
	const response = await fetchServerAPI<Track[]>(`${lookupRoute}/tracks`, token);
	return response.data!;
}

export async function getCarModels(token: string): Promise<CarModel[]> {
	const response = await fetchServerAPI<CarModel[]>(`${lookupRoute}/car-models`, token);
	return response.data!;
}

export async function getCupCategories(token: string): Promise<CupCategory[]> {
	const response = await fetchServerAPI<CupCategory[]>(`${lookupRoute}/cup-categories`, token);
	return response.data!;
}

export async function getDriverCategories(token: string): Promise<DriverCategory[]> {
	const response = await fetchServerAPI<DriverCategory[]>(
		`${lookupRoute}/driver-categories`,
		token
	);
	return response.data!;
}

export async function getSessionTypes(token: string): Promise<SessionType[]> {
	const response = await fetchServerAPI<SessionType[]>(`${lookupRoute}/session-types`, token);
	return response.data!;
}
