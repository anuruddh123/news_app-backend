// Notification Service
const Notification = require('../models/Notification');
const User = require('../models/User');
const emailService = require('./emailService');

class NotificationService {
  async createNotification(userId, newsData, notificationType = 'in-app') {
    try {
      const notification = new Notification({
        userId,
        articleId: newsData._id || newsData.sourceId,
        title: newsData.title,
        description: newsData.description,
        source: newsData.source,
        category: newsData.category,
        imageUrl: newsData.imageUrl || newsData.urlToImage,
        url: newsData.url,
        notificationType,
        deliveryStatus: 'pending',
      });

      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error.message);
      throw error;
    }
  }

  async sendNotifications(newsData, targetUsers) {
    try {
      const notifications = [];

      for (const target of targetUsers) {
        const user = target.user || target;
        const notificationMethods = target.notificationMethods || user.preferences?.notificationMethods || { email: true, push: false };

        // Create in-app notification
        const inAppNotif = await this.createNotification(user._id, newsData, 'in-app');
        notifications.push(inAppNotif);

        // Send email if enabled
        if (notificationMethods.email) {
          const emailNotif = await this.createNotification(user._id, newsData, 'email');
          const emailResult = await emailService.sendNewsAlert(user.email, newsData, user.name);

          if (emailResult.success) {
            await Notification.findByIdAndUpdate(emailNotif._id, { deliveryStatus: 'sent' });
          } else {
            await Notification.findByIdAndUpdate(emailNotif._id, {
              deliveryStatus: 'failed',
              deliveryError: emailResult.error,
            });
          }
        }

        // Push notification can be sent here if push service is configured
        if (notificationMethods.push) {
          const pushNotif = await this.createNotification(user._id, newsData, 'push');
          // TODO: Implement push notification service
        }
      }

      return notifications;
    } catch (error) {
      console.error('Error sending notifications:', error.message);
      throw error;
    }
  }

  async getNotifications(userId, limit = 20, skip = 0) {
    try {
      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
      return [];
    }
  }

  async getUnreadCount(userId) {
    try {
      const count = await Notification.countDocuments({ userId, isRead: false });
      return count;
    } catch (error) {
      console.error('Error getting unread count:', error.message);
      return 0;
    }
  }

  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true, readAt: new Date() },
        { new: true }
      );

      if (!notification || notification.userId.toString() !== userId.toString()) {
        return null;
      }

      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error.message);
      throw error;
    }
  }

  async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      return { success: true };
    } catch (error) {
      console.error('Error marking all notifications as read:', error.message);
      throw error;
    }
  }

  async deleteNotification(notificationId, userId) {
    try {
      const notification = await Notification.findByIdAndDelete(notificationId);

      if (!notification || notification.userId.toString() !== userId.toString()) {
        return null;
      }

      return notification;
    } catch (error) {
      console.error('Error deleting notification:', error.message);
      throw error;
    }
  }

  async deleteOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await Notification.deleteMany({ createdAt: { $lt: cutoffDate } });
      return result;
    } catch (error) {
      console.error('Error deleting old notifications:', error.message);
      throw error;
    }
  }
}

module.exports = new NotificationService();
