// Email Configuration
const nodemailer = require('nodemailer');

const emailConfig = {
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

const createTransporter = () => {
  return nodemailer.createTransport(emailConfig);
};

module.exports = {
  emailConfig,
  createTransporter,
};
