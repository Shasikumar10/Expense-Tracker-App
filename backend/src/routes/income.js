const express = require('express');
const router = express.Router();
const {
  getIncomes,
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
  getIncomeStats
} = require('../controllers/incomeController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

router.get('/stats', getIncomeStats);

router.route('/')
  .get(getIncomes)
  .post(createIncome);

router.route('/:id')
  .get(getIncome)
  .put(updateIncome)
  .delete(deleteIncome);

module.exports = router;
