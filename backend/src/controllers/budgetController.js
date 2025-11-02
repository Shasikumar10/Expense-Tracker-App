const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// @desc    Get all budgets for a user
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
  try {
    const { period, isActive } = req.query;
    const query = { user: req.user._id };

    if (period) query.period = period;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const budgets = await Budget.find(query).sort({ createdAt: -1 });

    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const expenses = await Expense.find({
          user: req.user._id,
          category: budget.category,
          date: { $gte: budget.startDate, $lte: budget.endDate || new Date() }
        });

        const spent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const status = await budget.checkBudgetStatus(spent);

        return {
          ...budget.toObject(),
          spent,
          ...status
        };
      })
    );

    res.status(200).json({
      success: true,
      count: budgetsWithSpent.length,
      data: budgetsWithSpent
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching budgets',
      error: error.message
    });
  }
};

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
const getBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this budget'
      });
    }

    // Calculate spent amount
    const expenses = await Expense.find({
      user: req.user._id,
      category: budget.category,
      date: { $gte: budget.startDate, $lte: budget.endDate || new Date() }
    });

    const spent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const status = await budget.checkBudgetStatus(spent);

    res.status(200).json({
      success: true,
      data: {
        ...budget.toObject(),
        spent,
        ...status
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching budget',
      error: error.message
    });
  }
};

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
const createBudget = async (req, res) => {
  try {
    req.body.user = req.user._id;

    // Check if budget already exists for this category and period
    const existingBudget = await Budget.findOne({
      user: req.user._id,
      category: req.body.category,
      period: req.body.period,
      isActive: true
    });

    if (existingBudget) {
      return res.status(400).json({
        success: false,
        message: 'Active budget already exists for this category and period'
      });
    }

    // Set end date based on period if not provided
    if (!req.body.endDate) {
      const startDate = new Date(req.body.startDate || Date.now());
      const endDate = new Date(startDate);

      switch(req.body.period) {
        case 'weekly':
          endDate.setDate(endDate.getDate() + 7);
          break;
        case 'monthly':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'yearly':
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }

      req.body.endDate = endDate;
    }

    const budget = await Budget.create(req.body);

    res.status(201).json({
      success: true,
      data: budget
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error creating budget',
      error: error.message
    });
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = async (req, res) => {
  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this budget'
      });
    }

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating budget',
      error: error.message
    });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this budget'
      });
    }

    await budget.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting budget',
      error: error.message
    });
  }
};

// @desc    Get budget overview
// @route   GET /api/budgets/overview
// @access  Private
const getBudgetOverview = async (req, res) => {
  try {
    const budgets = await Budget.find({
      user: req.user._id,
      isActive: true
    });

    let totalBudgeted = 0;
    let totalSpent = 0;
    const alerts = [];

    for (const budget of budgets) {
      const expenses = await Expense.find({
        user: req.user._id,
        category: budget.category,
        date: { $gte: budget.startDate, $lte: budget.endDate || new Date() }
      });

      const spent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const status = await budget.checkBudgetStatus(spent);

      totalBudgeted += budget.amount;
      totalSpent += spent;

      if (status.alertTriggered) {
        alerts.push({
          category: budget.category,
          budgeted: budget.amount,
          spent,
          percentage: status.percentage,
          exceeded: status.exceeded
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalBudgeted,
        totalSpent,
        remaining: totalBudgeted - totalSpent,
        percentage: ((totalSpent / totalBudgeted) * 100).toFixed(2),
        alerts,
        activeBudgets: budgets.length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching budget overview',
      error: error.message
    });
  }
};

module.exports = {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetOverview
};
