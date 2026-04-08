// News Controller
const News = require('../models/News');
const newsService = require('../services/newsService');

exports.getNews = async (req, res, next) => {
  try {
    const { category, limit = 20, skip = 0 } = req.query;

    const news = await newsService.getLatestNews(category, parseInt(limit), parseInt(skip));

    const totalCount = await News.countDocuments(category ? { category } : {});

    res.json({
      success: true,
      data: news,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        skip: parseInt(skip),
        pages: Math.ceil(totalCount / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getBreakingNews = async (req, res, next) => {
  try {
    const news = await newsService.getBreakingNews();

    res.json({
      success: true,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};
exports.getCategoryNews = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    const validCategories = ['politics', 'sports', 'technology', 'science', 'business', 'health', 'entertainment', 'general'];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category',
      });
    }

    const news = await newsService.getLatestNews(category, parseInt(limit), parseInt(skip));

    const totalCount = await News.countDocuments(category ? { category } : {});

    res.json({
      success: true,
      data: news,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        skip: parseInt(skip),
        pages: Math.ceil(totalCount / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const news = await newsService.getNewsById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found',
      });
    }

    // Increase views
    await newsService.increaseNewsViews(id);

    res.json({
      success: true,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

exports.searchNews = async (req, res, next) => {
  try {
    const { keyword, limit = 20 } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: 'Keyword is required',
      });
    }

    const news = await newsService.searchNewsByKeyword(keyword, parseInt(limit));

    res.json({
      success: true,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

exports.shareNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found',
      });
    }

    await newsService.shareNews(id);

    res.json({
      success: true,
      message: 'News shared successfully',
      shares: news.shares + 1,
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchAndSaveNews = async (req, res, next) => {
  try {
    const categories = ['general', 'sports', 'technology', 'business', 'health', 'science', 'entertainment'];
exports.getNewsStats = async (req, res, next) => {
  try {
    const totalArticles = await News.countDocuments();
    const totalViews = await News.aggregate([
      { $group: { _id: null, total: { $sum: $views } } }
    ]);
    const topCategory = await News.aggregate([
      { $group: { _id: $category, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    res.json({
      success: true,
      data: {
        totalArticles,
        totalViews: totalViews[0]?.total || 0,
        topCategory: topCategory[0]?._id || 'N/A',
      },
    });
  } catch (error) {
    next(error);
  }
};
