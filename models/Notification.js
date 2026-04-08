// Notification Model
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    articleId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    source: String,
    category: {
      type: String,
      enum: ['politics', 'sports', 'technology', 'science', 'business', 'health', 'entertainment', 'general'],
    },
    imageUrl: String,
    url: String,
    notificationType: {
      type: String,
      enum: ['email', 'push', 'in-app'],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    deliveryStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
    deliveryError: String,
    readAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ deliveryStatus: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
