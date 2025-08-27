import { fetchServerAPI } from './base';
import { Track, CarModel, CupCategory, DriverCategory, SessionType } from '@/lib/types';

const lookupRoute = '/lookup';

export async function getTracks(token: string): Promise<Track[]> {
	return fetchServerAPI(`${lookupRoute}/tracks`, token);
}

export async function getCarModels(token: string): Promise<CarModel[]> {
	return fetchServerAPI(`${lookupRoute}/car-models`, token);
}

export async function getCupCategories(token: string): Promise<CupCategory[]> {
	return fetchServerAPI(`${lookupRoute}/cup-categories`, token);
}

export async function getDriverCategories(token: string): Promise<DriverCategory[]> {
	return fetchServerAPI(`${lookupRoute}/driver-categories`, token);
}

export async function getSessionTypes(token: string): Promise<SessionType[]> {
	return fetchServerAPI(`${lookupRoute}/session-types`, token);
}
