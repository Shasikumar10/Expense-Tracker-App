import api from './api';

// Get all budgets
export const getBudgets = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await api.get(`/budgets?${queryParams}`);
  return response.data;
};

// Get single budget
export const getBudget = async (id) => {
  const response = await api.get(`/budgets/${id}`);
  return response.data;
};

// Create budget
export const createBudget = async (budgetData) => {
  const response = await api.post('/budgets', budgetData);
  return response.data;
};

// Update budget
export const updateBudget = async (id, budgetData) => {
  const response = await api.put(`/budgets/${id}`, budgetData);
  return response.data;
};

// Delete budget
export const deleteBudget = async (id) => {
  const response = await api.delete(`/budgets/${id}`);
  return response.data;
};

// Get budget overview
export const getBudgetOverview = async () => {
  const response = await api.get('/budgets/overview');
  return response.data;
};
