import fetchAPI from "$api/apiService";

export const getCarModels = async () => {
  return fetchAPI("/lookup/car-models");
};

export const getCupCategories = async () => {
  return fetchAPI("/lookup/cup-categories");
};

export const getDriverCategories = async () => {
  return fetchAPI("/lookup/driver-categories");
};

export const getSessionTypes = async () => {
  return fetchAPI("/lookup/session-types");
};

export const getTracks = async () => {
  return fetchAPI("/lookup/tracks");
};
