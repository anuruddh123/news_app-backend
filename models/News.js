// News Model
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: String,
    content: String,
    source: {
      type: String,
      required: true,
    },
    sourceId: {
      type: String,
      unique: true,
      sparse: true,
    },
    category: {
      type: String,
      enum: ['politics', 'sports', 'technology', 'science', 'business', 'health', 'entertainment', 'general'],
      index: true,
    },
    imageUrl: String,
    url: {
      type: String,
      required: true,
    },
    author: String,
    publishedAt: {
      type: Date,
      index: true,
    },
    priority: {
      type: Number,
      default: 0,
    },
    isBreaking: {
      type: Boolean,
      default: false,
    },
    keywords: [String],
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral',
    },
    views: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    isAlerted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 2592000, // 30 days TTL
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
newsSchema.index({ category: 1, publishedAt: -1 });
newsSchema.index({ source: 1, publishedAt: -1 });
newsSchema.index({ isBreaking: 1, publishedAt: -1 });
newsSchema.index({ keywords: 1 });

module.exports = mongoose.model('News', newsSchema);
