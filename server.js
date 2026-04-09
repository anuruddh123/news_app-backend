// Main Server File
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIO = require('socket.io');
const cron = require('node-cron');

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const alertRoutes = require('./routes/alertRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import services
const newsService = require('./services/newsService');
const notificationService = require('./services/notificationService');

// Import models
const Alert = require('./models/Alert');
const News = require('./models/News');
const User = require('./models/User');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = socketIO(server, {
  cors: {
    origin: process.env.SOCKET_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Store connected users
const connectedUsers = new Map();

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} joined`);
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connect to MongoDB Atlas only
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/notifications', notificationRoutes);

// Root route for browser test
app.get('/', (req, res) => {
  res.send('Server is running with MongoDB Atlas!');
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// Scheduled Tasks
// Fetch news every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('Fetching news from API...');
  try {
    const categories = ['general', 'sports', 'technology', 'business', 'health', 'science', 'entertainment'];

    for (const category of categories) {
      const articles = await newsService.fetchNewsFromAPI(category);
      await newsService.saveNews(articles, category);
    }

    console.log('News fetched and saved successfully');
  } catch (error) {
    console.error('Error fetching news:', error.message);
  }
});

// Process alerts every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  console.log('Processing alerts...');
  try {
    const alerts = await Alert.find({ isActive: true }).populate('userId');
    const now = new Date();

    for (const alert of alerts) {
      const lastTriggered = alert.lastTriggeredAt || new Date(0);
      const minutesDiff = (now - lastTriggered) / (1000 * 60);
      let shouldTrigger = false;

      if (alert.frequency === 'immediate' && minutesDiff >= 1) shouldTrigger = true;
      else if (alert.frequency === 'hourly' && minutesDiff >= 60) shouldTrigger = true;
      else if (alert.frequency === 'daily' && minutesDiff >= 1440) shouldTrigger = true;

      if (shouldTrigger) {
        const latestNews = await News.findOne({ category: alert.category, isAlerted: false })
          .sort({ publishedAt: -1 })
          .lean();

        if (latestNews) {
          await notificationService.sendNotifications(latestNews, [
            { user: alert.userId, notificationMethods: alert.notificationMethods },
          ]);

          await News.findByIdAndUpdate(latestNews._id, { isAlerted: true });
          alert.lastTriggeredAt = now;
          await alert.save();

          const socketId = connectedUsers.get(alert.userId._id.toString());
          if (socketId) {
            io.to(socketId).emit('newAlert', {
              title: latestNews.title,
              category: latestNews.category,
              notification: {
                title: latestNews.title,
                description: latestNews.description,
                image: latestNews.imageUrl,
                url: latestNews.url,
              },
            });
          }
        }
      }
    }

    console.log('Alerts processed successfully');
  } catch (error) {
    console.error('Error processing alerts:', error.message);
  }
});

// Clean up old notifications every day at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Cleaning up old notifications...');
  try {
    await notificationService.deleteOldNotifications(30);
    console.log('Old notifications cleaned up');
  } catch (error) {
    console.error('Error cleaning up notifications:', error.message);
  }
});

// Global error handler
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✓ Server is running on port ${PORT}`);
  console.log(`✓ Socket.io is ready for real-time updates`);
});

module.exports = { app, server, io };