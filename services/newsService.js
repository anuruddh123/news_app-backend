// News Service
const axios = require('axios');
const News = require('../models/News');

class NewsService {
  constructor() {
    this.newsApiKey = process.env.NEWS_API_KEY || 'demo';
    this.newsApiBaseUrl = 'https://newsapi.org/v2';
    this.categoryMap = {
      business: 'business',
      entertainment: 'entertainment',
      health: 'health',
      science: 'science',
      sports: 'sports',
      technology: 'technology',
      politics: 'politics',
      general: 'general',
    };
  }

  async fetchNewsFromAPI(category = 'general', limit = 20) {
    try {
      const categoryParam = this.categoryMap[category] || 'general';
      const url = `${this.newsApiBaseUrl}/top-headlines`;

      const response = await axios.get(url, {
        params: {
          category: categoryParam,
          country: 'us',
          apiKey: this.newsApiKey,
          pageSize: limit,
          sortBy: 'publishedAt',
        },
        timeout: 10000,
      });

      if (response.data.status !== 'ok') {
        console.error(`NewsAPI Error for ${category}:`, response.data.message);
        return [];
      }

      return response.data.articles || [];
    } catch (error) {
      console.error(`Error fetching news for ${category}:`, error.response?.data || error.message);
      return [];
    }
  }

  async searchNews(searchQuery, limit = 20) {
    try {
      const url = `${this.newsApiBaseUrl}/everything`;

      const response = await axios.get(url, {
        params: {
          q: searchQuery,
          apiKey: this.newsApiKey,
          pageSize: limit,
          sortBy: 'publishedAt',
          language: 'en',
        },
        timeout: 10000,
      });

      return response.data.articles || [];
    } catch (error) {
      console.error('Error searching news:', error.message);
      return [];
    }
  }

  async saveNews(articles, category) {
    try {
      for (const article of articles) {
        const sourceId = `${article.source.id || article.source.name}-${Date.parse(article.publishedAt)}`;

        await News.updateOne(
          { sourceId },
          {
            $setOnInsert: {
              title: article.title,
              description: article.description,
              content: article.content,
              source: article.source.name,
              sourceId,
              category,
              imageUrl: article.urlToImage,
              url: article.url,
              author: article.author,
              publishedAt: article.publishedAt,
              keywords: article.title.toLowerCase().split(/\s+/).slice(0, 5),
            },
          },
          { upsert: true }
        );
      }
    } catch (error) {
      console.error('Error saving news:', error.message);
    }
  }

  async getLatestNews(category = null, limit = 20, skip = 0) {
    try {
      const query = category ? { category } : {};
      const news = await News.find(query)
        .sort({ publishedAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      return news;
    } catch (error) {
      console.error('Error fetching latest news:', error.message);
      return [];
    }
  }

  async getBreakingNews() {
    try {
      const news = await News.find({ isBreaking: true })
        .sort({ publishedAt: -1 })
        .limit(10)
        .lean();

      return news;
    } catch (error) {
      console.error('Error fetching breaking news:', error.message);
      return [];
    }
  }

  async increaseNewsViews(newsId) {
    try {
      return await News.findByIdAndUpdate(newsId, { $inc: { views: 1 } }, { new: true });
    } catch (error) {
      console.error('Error updating news views:', error.message);
      return null;
    }
  }

  async shareNews(newsId) {
    try {
      await News.findByIdAndUpdate(newsId, { $inc: { shares: 1 } });
    } catch (error) {
      console.error('Error updating news shares:', error.message);
    }
  }

  async getNewsById(newsId) {
    try {
      const news = await News.findById(newsId);
      return news;
    } catch (error) {
      console.error('Error fetching news by ID:', error.message);
      return null;
    }
  }

  async searchNewsByKeyword(keyword, limit = 20) {
    try {
      const news = await News.find({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { keywords: keyword.toLowerCase() },
        ],
      })
        .sort({ publishedAt: -1 })
        .limit(limit)
        .lean();

      return news;
    } catch (error) {
      console.error('Error searching news by keyword:', error.message);
      return [];
    }
  }
}

module.exports = new NewsService();
