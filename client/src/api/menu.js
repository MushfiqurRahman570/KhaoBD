import api from './axios';

export const fetchMenu = (restaurantId) => api
  .get(`/restaurants/${restaurantId}/menu`).then((r) => r.data);

export const createMenuItem = (restaurantId, data) => api
  .post(`/restaurants/${restaurantId}/menu`, data).then((r) => r.data);

export const updateMenuItem = (id, data) => api.put(`/menu/${id}`, data).then((r) => r.data);

export const deleteMenuItem = (id) => api.delete(`/menu/${id}`).then((r) => r.data);

export const uploadMenuItemPhoto = (id, formData) => api
  .post(`/menu/${id}/photo`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  .then((r) => r.data);
