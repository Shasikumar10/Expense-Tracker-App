import api from './api';

// Get all recurring expenses
export const getRecurringExpenses = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await api.get(`/recurring-expenses?${queryParams}`);
  return response.data;
};

// Get single recurring expense
export const getRecurringExpense = async (id) => {
  const response = await api.get(`/recurring-expenses/${id}`);
  return response.data;
};

// Create recurring expense
export const createRecurringExpense = async (data) => {
  const response = await api.post('/recurring-expenses', data);
  return response.data;
};

// Update recurring expense
export const updateRecurringExpense = async (id, data) => {
  const response = await api.put(`/recurring-expenses/${id}`, data);
  return response.data;
};

// Delete recurring expense
export const deleteRecurringExpense = async (id) => {
  const response = await api.delete(`/recurring-expenses/${id}`);
  return response.data;
};

// Process due recurring expenses
export const processDueRecurringExpenses = async () => {
  const response = await api.post('/recurring-expenses/process');
  return response.data;
};

// Get upcoming recurring expenses
export const getUpcomingRecurringExpenses = async (days = 7) => {
  const response = await api.get(`/recurring-expenses/upcoming?days=${days}`);
  return response.data;
};
