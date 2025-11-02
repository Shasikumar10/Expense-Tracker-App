const express = require('express');
const router = express.Router();
const {
  getRecurringExpenses,
  getRecurringExpense,
  createRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
  processDueRecurringExpenses,
  getUpcomingRecurringExpenses
} = require('../controllers/recurringExpenseController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

router.post('/process', processDueRecurringExpenses);
router.get('/upcoming', getUpcomingRecurringExpenses);

router.route('/')
  .get(getRecurringExpenses)
  .post(createRecurringExpense);

router.route('/:id')
  .get(getRecurringExpense)
  .put(updateRecurringExpense)
  .delete(deleteRecurringExpense);

module.exports = router;
