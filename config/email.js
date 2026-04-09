// Email Configuration
const nodemailer = require('nodemailer');

const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Must be Gmail App Password
  },
  // Additional settings for better reliability
  tls: {
    rejectUnauthorized: false
  }
};

const createTransporter = () => {
  const transporter = nodemailer.createTransport(emailConfig);

  // Add error handling
  transporter.on('error', (error) => {
    console.error('Email transporter error:', error);
  });

  return transporter;
};

module.exports = {
  emailConfig,
  createTransporter,
};
