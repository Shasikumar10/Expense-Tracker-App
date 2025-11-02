const RecurringExpense = require('../models/RecurringExpense');
const Expense = require('../models/Expense');

// @desc    Get all recurring expenses for a user
// @route   GET /api/recurring-expenses
// @access  Private
const getRecurringExpenses = async (req, res) => {
  try {
    const { isActive } = req.query;
    const query = { user: req.user._id };

    if (isActive !== undefined) query.isActive = isActive === 'true';

    const recurringExpenses = await RecurringExpense.find(query).sort({ nextDueDate: 1 });

    res.status(200).json({
      success: true,
      count: recurringExpenses.length,
      data: recurringExpenses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recurring expenses',
      error: error.message
    });
  }
};

// @desc    Get single recurring expense
// @route   GET /api/recurring-expenses/:id
// @access  Private
const getRecurringExpense = async (req, res) => {
  try {
    const recurringExpense = await RecurringExpense.findById(req.params.id);

    if (!recurringExpense) {
      return res.status(404).json({
        success: false,
        message: 'Recurring expense not found'
      });
    }

    if (recurringExpense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this recurring expense'
      });
    }

    res.status(200).json({
      success: true,
      data: recurringExpense
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recurring expense',
      error: error.message
    });
  }
};

// @desc    Create new recurring expense
// @route   POST /api/recurring-expenses
// @access  Private
const createRecurringExpense = async (req, res) => {
  try {
    req.body.user = req.user._id;

    // Set initial nextDueDate if not provided
    if (!req.body.nextDueDate) {
      req.body.nextDueDate = req.body.startDate || new Date();
    }

    const recurringExpense = await RecurringExpense.create(req.body);

    res.status(201).json({
      success: true,
      data: recurringExpense
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error creating recurring expense',
      error: error.message
    });
  }
};

// @desc    Update recurring expense
// @route   PUT /api/recurring-expenses/:id
// @access  Private
const updateRecurringExpense = async (req, res) => {
  try {
    let recurringExpense = await RecurringExpense.findById(req.params.id);

    if (!recurringExpense) {
      return res.status(404).json({
        success: false,
        message: 'Recurring expense not found'
      });
    }

    if (recurringExpense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this recurring expense'
      });
    }

    recurringExpense = await RecurringExpense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: recurringExpense
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating recurring expense',
      error: error.message
    });
  }
};

// @desc    Delete recurring expense
// @route   DELETE /api/recurring-expenses/:id
// @access  Private
const deleteRecurringExpense = async (req, res) => {
  try {
    const recurringExpense = await RecurringExpense.findById(req.params.id);

    if (!recurringExpense) {
      return res.status(404).json({
        success: false,
        message: 'Recurring expense not found'
      });
    }

    if (recurringExpense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this recurring expense'
      });
    }

    await recurringExpense.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Recurring expense deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting recurring expense',
      error: error.message
    });
  }
};

// @desc    Process due recurring expenses
// @route   POST /api/recurring-expenses/process
// @access  Private
const processDueRecurringExpenses = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all due recurring expenses
    const dueExpenses = await RecurringExpense.find({
      user: req.user._id,
      isActive: true,
      autoCreate: true,
      nextDueDate: { $lte: today }
    });

    const createdExpenses = [];

    for (const recurring of dueExpenses) {
      // Create actual expense
      const expense = await Expense.create({
        user: req.user._id,
        title: recurring.title,
        amount: recurring.amount,
        category: recurring.category,
        date: recurring.nextDueDate,
        description: `${recurring.description || ''} (Auto-created from recurring expense)`,
        paymentMethod: recurring.paymentMethod,
        isRecurring: true
      });

      createdExpenses.push(expense);

      // Update next due date
      recurring.nextDueDate = recurring.calculateNextDueDate();
      
      // Check if end date has passed
      if (recurring.endDate && recurring.nextDueDate > recurring.endDate) {
        recurring.isActive = false;
      }

      await recurring.save();
    }

    res.status(200).json({
      success: true,
      message: `Processed ${createdExpenses.length} recurring expenses`,
      data: createdExpenses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error processing recurring expenses',
      error: error.message
    });
  }
};

// @desc    Get upcoming recurring expenses
// @route   GET /api/recurring-expenses/upcoming
// @access  Private
const getUpcomingRecurringExpenses = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + parseInt(days));

    // Find all active recurring expenses for the user
    const upcomingExpenses = await RecurringExpense.find({
      user: req.user._id,
      isActive: true,
      nextDueDate: { $exists: true, $ne: null }
    }).sort({ nextDueDate: 1 });

    // Filter out invalid dates and only keep those within range
    const validUpcoming = upcomingExpenses.filter(expense => {
      const dueDate = new Date(expense.nextDueDate);
      return !isNaN(dueDate.getTime()) && dueDate >= today && dueDate <= futureDate;
    });

    res.status(200).json({
      success: true,
      count: validUpcoming.length,
      data: validUpcoming
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming recurring expenses',
      error: error.message
    });
  }
};

module.exports = {
  getRecurringExpenses,
  getRecurringExpense,
  createRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
  processDueRecurringExpenses,
  getUpcomingRecurringExpenses
};
