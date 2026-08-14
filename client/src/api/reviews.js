import api from './axios';

export const fetchReviews = (restaurantId) => api
  .get(`/restaurants/${restaurantId}/reviews`).then((r) => r.data);

export const createReview = (restaurantId, data) => api
  .post(`/restaurants/${restaurantId}/reviews`, data).then((r) => r.data);

export const likeReview = (reviewId) => api.post(`/reviews/${reviewId}/like`).then((r) => r.data);

export const uploadReviewPhotos = (reviewId, formData) => api
  .post(`/reviews/${reviewId}/photos`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  .then((r) => r.data);
