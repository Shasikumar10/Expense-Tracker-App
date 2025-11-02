import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Register user
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.success) {
    await AsyncStorage.setItem('token', response.data.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.success) {
    await AsyncStorage.setItem('token', response.data.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

// Logout user
export const logout = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Check if user is logged in
export const isLoggedIn = async () => {
  const token = await AsyncStorage.getItem('token');
  return !!token;
};

// Get stored user
export const getStoredUser = async () => {
  const userStr = await AsyncStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
