import api from './axios';

export const fetchRestaurants = (params) => api.get('/restaurants', { params }).then((r) => r.data);
export const fetchRestaurant = (id) => api.get(`/restaurants/${id}`).then((r) => r.data);
export const fetchAreas = () => api.get('/areas').then((r) => r.data);
export const fetchCuisines = () => api.get('/cuisines').then((r) => r.data);
export const createRestaurant = (data) => api.post('/restaurants', data).then((r) => r.data);
export const updateRestaurant = (id, data) => api.put(`/restaurants/${id}`, data).then((r) => r.data);
export const uploadRestaurantPhotos = (id, formData) => api
  .post(`/restaurants/${id}/photos`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  .then((r) => r.data);
