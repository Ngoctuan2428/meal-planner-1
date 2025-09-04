import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động gắn token vào header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // token lưu khi login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==== Auth ====
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// ==== Meals ====
export const generateMeals = (data) => API.post('/meals/generate', data);

// ==== Image (Calorie Estimation) ====
export const estimateCaloriesFromText = (data) => API.post('/image/estimate-text', data);
export const estimateCaloriesFromImage = (formData) =>
  API.post('/image/estimate-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// ==== Workout ====
export const generateWorkoutPlan = (data) => API.post('/workouts/generate', data);

// ==== History ====
export const getHistory = (userId) => API.get(`/history/${userId}`);

export default API;
