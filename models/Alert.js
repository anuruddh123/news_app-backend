// Alert Model
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['politics', 'sports', 'technology', 'science', 'business', 'health', 'entertainment', 'general'],
    },
    frequency: {
      type: String,
      required: true,
      enum: ['immediate', 'hourly', 'daily'],
    },
    keywords: [String],
    notificationMethods: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastTriggeredAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
alertSchema.index({ userId: 1, category: 1 });
alertSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('Alert', alertSchema);
