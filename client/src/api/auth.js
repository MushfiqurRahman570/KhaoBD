import api from './axios';

export const registerUser = (data) => api.post('/auth/register', data).then((r) => r.data);
export const loginUser = (data) => api.post('/auth/login', data).then((r) => r.data);
export const fetchMe = () => api.get('/auth/me').then((r) => r.data);
export const updateProfile = (data) => api.put('/auth/me', data).then((r) => r.data);
export const changePassword = (data) => api.put('/auth/password', data).then((r) => r.data);
export const uploadAvatar = (formData) => api
  .post('/auth/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  .then((r) => r.data);
