const mongoose = require('mongoose');

const recurringExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: [0, 'Amount cannot be negative']
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
  frequency: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly']
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date'],
    default: Date.now
  },
  endDate: {
    type: Date
  },
  nextDueDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet', 'Other'],
    default: 'Cash'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  autoCreate: {
    type: Boolean,
    default: true
  },
  reminderDays: {
    type: Number,
    default: 3,
    min: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
recurringExpenseSchema.index({ user: 1, nextDueDate: 1, isActive: 1 });

// Method to calculate next due date based on frequency
recurringExpenseSchema.methods.calculateNextDueDate = function() {
  const current = new Date(this.nextDueDate);
  
  switch(this.frequency) {
    case 'daily':
      current.setDate(current.getDate() + 1);
      break;
    case 'weekly':
      current.setDate(current.getDate() + 7);
      break;
    case 'bi-weekly':
      current.setDate(current.getDate() + 14);
      break;
    case 'monthly':
      current.setMonth(current.getMonth() + 1);
      break;
    case 'quarterly':
      current.setMonth(current.getMonth() + 3);
      break;
    case 'yearly':
      current.setFullYear(current.getFullYear() + 1);
      break;
  }
  
  return current;
};

module.exports = mongoose.model('RecurringExpense', recurringExpenseSchema);
