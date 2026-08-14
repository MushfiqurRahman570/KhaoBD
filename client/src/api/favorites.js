import api from './axios';

export const fetchFavorites = () => api.get('/favorites').then((r) => r.data);
export const addFavorite = (restaurantId) => api.post(`/favorites/${restaurantId}`).then((r) => r.data);
export const removeFavorite = (restaurantId) => api.delete(`/favorites/${restaurantId}`).then((r) => r.data);
