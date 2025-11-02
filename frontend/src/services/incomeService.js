import api from './api';

// Get all income
export const getIncomes = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await api.get(`/income?${queryParams}`);
  return response.data;
};

// Get single income
export const getIncome = async (id) => {
  const response = await api.get(`/income/${id}`);
  return response.data;
};

// Create income
export const createIncome = async (incomeData) => {
  const response = await api.post('/income', incomeData);
  return response.data;
};

// Update income
export const updateIncome = async (id, incomeData) => {
  const response = await api.put(`/income/${id}`, incomeData);
  return response.data;
};

// Delete income
export const deleteIncome = async (id) => {
  const response = await api.delete(`/income/${id}`);
  return response.data;
};

// Get income statistics
export const getIncomeStats = async () => {
  const response = await api.get('/income/stats');
  return response.data;
};
