const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  placeName: {
    type: String,
    required: true,
    trim: true
  },
  locationLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {

        // Basic URL validation
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Location link must be a valid URL'
    }
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  photo: {
    type: String, // Base64 encoded image
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Validate that toDate is after fromDate
memorySchema.pre('save', function(next) {
  if (this.fromDate && this.toDate) {
    if (this.toDate < this.fromDate) {
      const error = new Error('To date must be after from date');
      return next(error);
    }
  }
  this.updatedAt = Date.now();
  next();
});

// Virtual for formatted date range
memorySchema.virtual('dateRange').get(function() {
  const fromStr = this.fromDate.toLocaleDateString();
  const toStr = this.toDate.toLocaleDateString();
  return fromStr === toStr ? fromStr : `${fromStr} - ${toStr}`;
});

// Virtual for year
memorySchema.virtual('year').get(function() {
  return this.fromDate.getFullYear();
});

// Virtual for month
memorySchema.virtual('month').get(function() {
  return this.fromDate.getMonth();
});

// Virtual for month name
memorySchema.virtual('monthName').get(function() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[this.month];
});

// Ensure virtual fields are serialized
memorySchema.set('toJSON', { virtuals: true });
memorySchema.set('toObject', { virtuals: true });

// Index for efficient queries
memorySchema.index({ user: 1, fromDate: -1 });
memorySchema.index({ user: 1, 'fromDate.year': 1, 'fromDate.month': 1 });

module.exports = mongoose.model('Memory', memorySchema);
