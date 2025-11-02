import api from './api';

// Get financial summary
export const getFinancialSummary = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const response = await api.get(`/reports/summary?${queryParams}`);
  return response.data;
};

// Get monthly comparison
export const getMonthlyComparison = async (months = 6) => {
  const response = await api.get(`/reports/monthly-comparison?months=${months}`);
  return response.data;
};

// Get category analysis
export const getCategoryAnalysis = async (period = 'month') => {
  const response = await api.get(`/reports/category-analysis?period=${period}`);
  return response.data;
};

// Get spending patterns
export const getSpendingPatterns = async () => {
  const response = await api.get('/reports/spending-patterns');
  return response.data;
};

// Export data
export const exportData = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const response = await api.get(`/reports/export?${queryParams}`);
  return response.data;
};
