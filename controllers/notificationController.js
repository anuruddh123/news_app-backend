// Notifications Controller
const Notification = require('../models/Notification');
const notificationService = require('../services/notificationService');

exports.getNotifications = async (req, res, next) => {
  try {
    const { limit = 20, skip = 0 } = req.query;

    const notifications = await notificationService.getNotifications(
      req.userId,
      parseInt(limit),
      parseInt(skip)
    );

    const totalCount = await Notification.countDocuments({ userId: req.userId });

    res.json({
      success: true,
      data: notifications,
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

exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await notificationService.getUnreadCount(req.userId);

    res.json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await notificationService.markAsRead(id, req.userId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await notificationService.markAllAsRead(req.userId);

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await notificationService.deleteNotification(id, req.userId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.getNotificationsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    const notifications = await Notification.find({
      userId: req.userId,
      category,
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean();

    const totalCount = await Notification.countDocuments({
      userId: req.userId,
      category,
    });

    res.json({
      success: true,
      data: notifications,
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

exports.getDashboardData = async (req, res, next) => {
  try {
    const totalNotifications = await Notification.countDocuments({ userId: req.userId });
    const unreadNotifications = await Notification.countDocuments({
      userId: req.userId,
      isRead: false,
    });

    // Get notification statistics by category
    const notificationsByCategory = await Notification.aggregate([
      { $match: { userId: req.userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Get notification statistics by type
    const notificationsByType = await Notification.aggregate([
      { $match: { userId: req.userId } },
      { $group: { _id: '$notificationType', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        totalNotifications,
        unreadNotifications,
        notificationsByCategory,
        notificationsByType,
      },
    });
  } catch (error) {
    next(error);
  }
};
