const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Budget = require('../models/Budget');

// @desc    Get financial summary
// @route   GET /api/reports/summary
// @access  Private
const getFinancialSummary = async (req, res) => {
  try {
    const { startDate, endDate, period = 'month' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    if (startDate && endDate) {
      dateFilter = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      // Default to current period
      const start = new Date();
      
      switch(period) {
        case 'week':
          start.setDate(start.getDate() - 7);
          break;
        case 'month':
          start.setMonth(start.getMonth() - 1);
          break;
        case 'year':
          start.setFullYear(start.getFullYear() - 1);
          break;
      }
      
      dateFilter = { $gte: start, $lte: now };
    }

    // Get total expenses
    const expenses = await Expense.find({
      user: req.user._id,
      date: dateFilter
    });

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Get total income
    const incomes = await Income.find({
      user: req.user._id,
      date: dateFilter
    });

    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

    // Calculate savings
    const savings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(2) : 0;

    // Expense by category
    const expensesByCategory = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: dateFilter
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    // Income by category
    const incomeByCategory = await Income.aggregate([
      {
        $match: {
          user: req.user._id,
          date: dateFilter
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    // Daily spending trend
    const dailyTrend = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: dateFilter
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpenses,
          savings,
          savingsRate: `${savingsRate}%`,
          transactionCount: expenses.length + incomes.length
        },
        expenses: {
          total: totalExpenses,
          byCategory: expensesByCategory,
          count: expenses.length
        },
        income: {
          total: totalIncome,
          byCategory: incomeByCategory,
          count: incomes.length
        },
        trends: {
          daily: dailyTrend
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error generating financial summary',
      error: error.message
    });
  }
};

// @desc    Get monthly comparison report
// @route   GET /api/reports/monthly-comparison
// @access  Private
const getMonthlyComparison = async (req, res) => {
  try {
    const { months = 6 } = req.query;
    const monthsData = [];

    for (let i = 0; i < parseInt(months); i++) {
      const start = new Date();
      start.setMonth(start.getMonth() - i);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);

      const expenses = await Expense.find({
        user: req.user._id,
        date: { $gte: start, $lte: end }
      });

      const incomes = await Income.find({
        user: req.user._id,
        date: { $gte: start, $lte: end }
      });

      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalIncome = incomes.reduce((sum, inc) => inc + inc.amount, 0);

      monthsData.push({
        month: start.toLocaleString('default', { month: 'long', year: 'numeric' }),
        income: totalIncome,
        expenses: totalExpenses,
        savings: totalIncome - totalExpenses,
        transactionCount: expenses.length + incomes.length
      });
    }

    res.status(200).json({
      success: true,
      data: monthsData.reverse()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error generating monthly comparison',
      error: error.message
    });
  }
};

// @desc    Get category-wise analysis
// @route   GET /api/reports/category-analysis
// @access  Private
const getCategoryAnalysis = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    const start = new Date();
    switch(period) {
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
    }

    const categoryAnalysis = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: start }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' },
          min: { $min: '$amount' },
          max: { $max: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    // Get budget comparison
    const budgets = await Budget.find({
      user: req.user._id,
      isActive: true
    });

    const categoryWithBudget = await Promise.all(
      categoryAnalysis.map(async (cat) => {
        const budget = budgets.find(b => b.category === cat._id);
        
        if (budget) {
          const budgetStatus = await budget.checkBudgetStatus(cat.total);
          return {
            ...cat,
            budget: budget.amount,
            budgetStatus
          };
        }
        
        return cat;
      })
    );

    res.status(200).json({
      success: true,
      data: categoryWithBudget
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error generating category analysis',
      error: error.message
    });
  }
};

// @desc    Get spending patterns
// @route   GET /api/reports/spending-patterns
// @access  Private
const getSpendingPatterns = async (req, res) => {
  try {
    // Day of week analysis
    const dayOfWeekSpending = await Expense.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayAnalysis = dayOfWeekSpending.map(day => ({
      day: dayNames[day._id - 1],
      total: day.total,
      count: day.count,
      average: day.average
    }));

    // Payment method analysis
    const paymentMethodAnalysis = await Expense.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    // Top expenses
    const topExpenses = await Expense.find({ user: req.user._id })
      .sort({ amount: -1 })
      .limit(10)
      .select('title amount category date');

    res.status(200).json({
      success: true,
      data: {
        byDayOfWeek: dayAnalysis,
        byPaymentMethod: paymentMethodAnalysis,
        topExpenses
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing spending patterns',
      error: error.message
    });
  }
};

// @desc    Export data to CSV format
// @route   GET /api/reports/export
// @access  Private
const exportData = async (req, res) => {
  try {
    const { type = 'expenses', startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    let data = [];
    let csvContent = '';

    if (type === 'expenses') {
      data = await Expense.find({
        user: req.user._id,
        ...dateFilter
      }).sort({ date: -1 });

      csvContent = 'Date,Title,Amount,Category,Payment Method,Description\n';
      data.forEach(item => {
        csvContent += `${new Date(item.date).toLocaleDateString()},"${item.title}",${item.amount},"${item.category}","${item.paymentMethod}","${item.description || ''}"\n`;
      });
    } else if (type === 'income') {
      data = await Income.find({
        user: req.user._id,
        ...dateFilter
      }).sort({ date: -1 });

      csvContent = 'Date,Source,Amount,Category,Description\n';
      data.forEach(item => {
        csvContent += `${new Date(item.date).toLocaleDateString()},"${item.source}",${item.amount},"${item.category}","${item.description || ''}"\n`;
      });
    }

    res.status(200).json({
      success: true,
      data: {
        csv: csvContent,
        count: data.length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error exporting data',
      error: error.message
    });
  }
};

module.exports = {
  getFinancialSummary,
  getMonthlyComparison,
  getCategoryAnalysis,
  getSpendingPatterns,
  exportData
};
