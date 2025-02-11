import { fetchAPIEvent } from '$api/apiService';
import type { CarModel, CupCategory, DriverCategory, SessionType, Track } from '$models/lookups';
import type { RequestEvent } from '@sveltejs/kit';

export const getCarModels = async (event: RequestEvent): Promise<CarModel[]> => {
	return fetchAPIEvent(event, '/lookup/car-models');
};

export const getCupCategories = async (event: RequestEvent): Promise<CupCategory[]> => {
	return fetchAPIEvent(event, '/lookup/cup-categories');
};

export const getDriverCategories = async (event: RequestEvent): Promise<DriverCategory[]> => {
	return fetchAPIEvent(event, '/lookup/driver-categories');
};

export const getSessionTypes = async (event: RequestEvent): Promise<SessionType[]> => {
	return fetchAPIEvent(event, '/lookup/session-types');
};

export const getTracks = async (event: RequestEvent): Promise<Track[]> => {
	return fetchAPIEvent(event, '/lookup/tracks');
};
