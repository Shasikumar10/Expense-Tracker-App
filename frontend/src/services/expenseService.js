import api from './api';

// Get all expenses
export const getExpenses = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await api.get(`/expenses?${queryParams}`);
  return response.data;
};

// Get single expense
export const getExpense = async (id) => {
  const response = await api.get(`/expenses/${id}`);
  return response.data;
};

// Create expense
export const createExpense = async (expenseData) => {
  const response = await api.post('/expenses', expenseData);
  return response.data;
};

// Update expense
export const updateExpense = async (id, expenseData) => {
  const response = await api.put(`/expenses/${id}`, expenseData);
  return response.data;
};

// Delete expense
export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};

// Get expense statistics
export const getExpenseStats = async () => {
  const response = await api.get('/expenses/stats');
  return response.data;
};
