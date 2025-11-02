const express = require('express');
const router = express.Router();
const {
  getFinancialSummary,
  getMonthlyComparison,
  getCategoryAnalysis,
  getSpendingPatterns,
  exportData
} = require('../controllers/reportsController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

router.get('/summary', getFinancialSummary);
router.get('/monthly-comparison', getMonthlyComparison);
router.get('/category-analysis', getCategoryAnalysis);
router.get('/spending-patterns', getSpendingPatterns);
router.get('/export', exportData);

module.exports = router;
