import api from './api';

export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const updateUserPassword = async (passwordData) => {
  try {
    const response = await api.put('/users/profile', { password: passwordData.newPassword });
    return response.data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const deleteUserAccount = async () => {
  try {
    const response = await api.delete('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error deleting user account:', error);
    throw error;
  }
};

export const exportUserData = async () => {
  try {
    // This will need backend implementation
    const response = await api.get('/users/export');
    return response.data;
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw error;
  }
};
