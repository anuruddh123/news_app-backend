// Demo News Seeder
// This script adds sample news to the database for testing
// Run this if you don't have a valid NEWS_API_KEY yet

require('dotenv').config();
const mongoose = require('mongoose');
const News = require('./models/News');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/news-alerts';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const demoNews = [
  {
    title: 'Breaking: New Technology Transforms Industry',
    description: 'A revolutionary breakthrough in technology is changing how we work and live.',
    content: 'This is a major development in the tech industry...',
    source: 'Tech Times',
    category: 'technology',
    imageUrl: 'https://via.placeholder.com/600x400?text=Technology',
    url: 'https://example.com/tech1',
    author: 'John Tech',
    publishedAt: new Date(),
    isBreaking: true,
    sentiment: 'positive',
  },
  {
    title: 'Sports: Championship Game Announced',
    description: 'The championship game has been scheduled for next month.',
    content: 'Teams are preparing for the biggest match of the season...',
    source: 'Sports Daily',
    category: 'sports',
    imageUrl: 'https://via.placeholder.com/600x400?text=Sports',
    url: 'https://example.com/sports1',
    author: 'Jane Sports',
    publishedAt: new Date(Date.now() - 3600000),
    isBreaking: false,
    sentiment: 'neutral',
  },
  {
    title: 'Health: New Disease Fighting Method',
    description: 'Scientists discover a promising new approach to treatment.',
    content: 'Medical researchers have made a significant discovery...',
    source: 'Health News',
    category: 'health',
    imageUrl: 'https://via.placeholder.com/600x400?text=Health',
    url: 'https://example.com/health1',
    author: 'Dr. Smith',
    publishedAt: new Date(Date.now() - 7200000),
    isBreaking: false,
    sentiment: 'positive',
  },
  {
    title: 'Business: Major Company Merger',
    description: 'Two tech giants announce major merger deal.',
    content: 'In a shocking announcement today, two major companies announced...',
    source: 'Business News',
    category: 'business',
    imageUrl: 'https://via.placeholder.com/600x400?text=Business',
    url: 'https://example.com/business1',
    author: 'Bob Finance',
    publishedAt: new Date(Date.now() - 10800000),
    isBreaking: true,
    sentiment: 'neutral',
  },
  {
    title: 'Science: Mars Discovery Made',
    description: 'New evidence of water discovered on Mars.',
    content: 'Scientists announce groundbreaking discovery on Mars...',
    source: 'Science Weekly',
    category: 'science',
    imageUrl: 'https://via.placeholder.com/600x400?text=Science',
    url: 'https://example.com/science1',
    author: 'Prof. Newton',
    publishedAt: new Date(Date.now() - 14400000),
    isBreaking: false,
    sentiment: 'positive',
  },
  {
    title: 'Entertainment: New Movie Released',
    description: 'Blockbuster film hits theaters this weekend.',
    content: 'The highly anticipated film has finally arrived in cinemas...',
    source: 'Entertainment Weekly',
    category: 'entertainment',
    imageUrl: 'https://via.placeholder.com/600x400?text=Entertainment',
    url: 'https://example.com/entertainment1',
    author: 'Alice Movie',
    publishedAt: new Date(Date.now() - 18000000),
    isBreaking: false,
    sentiment: 'positive',
  },
  {
    title: 'Politics: New Law Signed',
    description: 'Government passes significant new legislation.',
    content: 'lawmakers have unanimously approved the new bill...',
    source: 'Political News',
    category: 'politics',
    imageUrl: 'https://via.placeholder.com/600x400?text=Politics',
    url: 'https://example.com/politics1',
    author: 'Carol Politics',
    publishedAt: new Date(Date.now() - 21600000),
    isBreaking: false,
    sentiment: 'neutral',
  },
  {
    title: 'General: Community Comes Together',
    description: 'Local community organizes charity event.',
    content: 'The community gathered together to support those in need...',
    source: 'Local News',
    category: 'general',
    imageUrl: 'https://via.placeholder.com/600x400?text=Community',
    url: 'https://example.com/general1',
    author: 'Dave Community',
    publishedAt: new Date(Date.now() - 25200000),
    isBreaking: false,
    sentiment: 'positive',
  },
];

const seedNews = async () => {
  try {
    await connectDB();

    // Clear existing news
    await News.deleteMany({});
    console.log('✓ Cleared existing news');

    // Insert demo news
    const savedNews = await News.insertMany(demoNews);
    console.log(`✓ Inserted ${savedNews.length} demo news articles`);

    // Show summary
    const categories = {};
    for (const news of savedNews) {
      categories[news.category] = (categories[news.category] || 0) + 1;
    }
    console.log('\n📰 News by Category:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`);
    });

    console.log('\n✅ Demo news seeded successfully!');
    console.log('You can now test the app with this sample data.');
    console.log('\n💡 Next: Get a real NEWS_API_KEY from https://newsapi.org/');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding news:', error.message);
    process.exit(1);
  }
};

seedNews();
