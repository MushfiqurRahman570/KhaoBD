import api from './axios';

export const fetchMyBookings = () => api.get('/bookings').then((r) => r.data);
export const createBooking = (restaurantId, data) => api
  .post(`/restaurants/${restaurantId}/bookings`, data).then((r) => r.data);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`).then((r) => r.data);
