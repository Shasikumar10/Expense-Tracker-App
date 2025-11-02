const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Bills & Utilities',
      'Healthcare',
      'Education',
      'Travel',
      'Personal Care',
      'Groceries',
      'Housing',
      'Insurance',
      'Investments',
      'Other'
    ]
  },
  amount: {
    type: Number,
    required: [true, 'Please provide a budget amount'],
    min: [0, 'Budget amount cannot be negative']
  },
  period: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  alertThreshold: {
    type: Number,
    default: 80,
    min: 0,
    max: 100
  },
  notes: {
    type: String,
    maxlength: [300, 'Notes cannot exceed 300 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
budgetSchema.index({ user: 1, category: 1, isActive: 1 });

// Method to check if budget is exceeded
budgetSchema.methods.checkBudgetStatus = async function(spent) {
  const percentage = (spent / this.amount) * 100;
  return {
    exceeded: spent > this.amount,
    percentage: percentage.toFixed(2),
    remaining: this.amount - spent,
    alertTriggered: percentage >= this.alertThreshold
  };
};

module.exports = mongoose.model('Budget', budgetSchema);
