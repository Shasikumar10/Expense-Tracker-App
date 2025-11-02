const Income = require('../models/Income');

// @desc    Get all income for a user
// @route   GET /api/income
// @access  Private
const getIncomes = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    const query = { user: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (category) query.category = category;

    const incomes = await Income.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: incomes.length,
      data: incomes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching income',
      error: error.message
    });
  }
};

// @desc    Get single income
// @route   GET /api/income/:id
// @access  Private
const getIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income not found'
      });
    }

    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this income'
      });
    }

    res.status(200).json({
      success: true,
      data: income
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching income',
      error: error.message
    });
  }
};

// @desc    Create new income
// @route   POST /api/income
// @access  Private
const createIncome = async (req, res) => {
  try {
    req.body.user = req.user._id;

    // Calculate next date for recurring income
    if (req.body.isRecurring && req.body.frequency !== 'one-time') {
      const nextDate = new Date(req.body.date);
      
      switch(req.body.frequency) {
        case 'weekly':
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case 'bi-weekly':
          nextDate.setDate(nextDate.getDate() + 14);
          break;
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case 'quarterly':
          nextDate.setMonth(nextDate.getMonth() + 3);
          break;
        case 'yearly':
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
      }
      
      req.body.nextDate = nextDate;
    }

    const income = await Income.create(req.body);

    res.status(201).json({
      success: true,
      data: income
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error creating income',
      error: error.message
    });
  }
};

// @desc    Update income
// @route   PUT /api/income/:id
// @access  Private
const updateIncome = async (req, res) => {
  try {
    let income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income not found'
      });
    }

    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this income'
      });
    }

    income = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: income
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating income',
      error: error.message
    });
  }
};

// @desc    Delete income
// @route   DELETE /api/income/:id
// @access  Private
const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income not found'
      });
    }

    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this income'
      });
    }

    await income.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Income deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting income',
      error: error.message
    });
  }
};

// @desc    Get income statistics
// @route   GET /api/income/stats
// @access  Private
const getIncomeStats = async (req, res) => {
  try {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get category stats
    const stats = await Income.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    // Get total income
    const totalIncome = await Income.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get current month income
    const currentMonthIncome = await Income.aggregate([
      {
        $match: { 
          user: req.user._id,
          date: { $gte: currentMonthStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get last month income
    const lastMonthIncome = await Income.aggregate([
      {
        $match: { 
          user: req.user._id,
          date: { $gte: lastMonthStart, $lte: lastMonthEnd }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        byCategory: stats,
        total: totalIncome[0]?.total || 0,
        currentMonth: currentMonthIncome[0]?.total || 0,
        lastMonth: lastMonthIncome[0]?.total || 0,
        count: totalIncome[0]?.count || 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching income statistics',
      error: error.message
    });
  }
};

module.exports = {
  getIncomes,
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
  getIncomeStats
};
