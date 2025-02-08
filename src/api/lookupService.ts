import { fetchAPIEvent } from '$api/apiService';

export const getCarModels = async (event: object) => {
	return fetchAPIEvent(event, '/lookup/car-models');
};

export const getCupCategories = async (event: object) => {
	return fetchAPIEvent(event, '/lookup/cup-categories');
};

export const getDriverCategories = async (event: object) => {
	return fetchAPIEvent(event, '/lookup/driver-categories');
};

export const getSessionTypes = async (event: object) => {
	return fetchAPIEvent(event, '/lookup/session-types');
};

export const getTracks = async (event: object) => {
	return fetchAPIEvent(event, '/lookup/tracks');
};
