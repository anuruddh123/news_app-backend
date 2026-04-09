// Email Service
const { createTransporter } = require('../config/email');

class EmailService {
  constructor() {
    this.transporter = createTransporter();
  }

  async sendNewsAlert(emailAddress, newsData, userName) {
    try {
      console.log(`Attempting to send news alert email to: ${emailAddress}`);

      const mailOptions = {
        from: `"News Alerts" <${process.env.EMAIL_USER}>`,
        to: emailAddress,
        subject: `🚨 Breaking News Alert: ${newsData.title}`,
        html: this.generateEmailTemplate(newsData, userName),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Email sending failed:', error.message);
      console.error('Full error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPreferenceConfirmation(emailAddress, userName, preferences) {
    try {
      console.log(`Attempting to send preference confirmation email to: ${emailAddress}`);

      const mailOptions = {
        from: `"News Alerts" <${process.env.EMAIL_USER}>`,
        to: emailAddress,
        subject: '✓ Alert Preferences Updated',
        html: this.generatePreferenceTemplate(userName, preferences),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Preference confirmation email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Preference confirmation email failed:', error.message);
      console.error('Full error:', error);
      return { success: false, error: error.message };
    }
  }

  generateEmailTemplate(news, userName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-left: 5px solid #667eea; }
          .footer { font-size: 12px; color: #666; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🚨 Breaking News Alert</h2>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <h3>${news.title}</h3>
            <p>${news.description}</p>
            <p><strong>Source:</strong> ${news.source}</p>
            <p><strong>Published:</strong> ${new Date(news.publishedAt).toLocaleString()}</p>
            <a href="${news.url}" class="button">Read Full Article</a>
          </div>
          <div class="footer">
            <p>You received this email because of your alert preferences for ${news.category} news.</p>
            <p>Manage your preferences by logging into your dashboard.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generatePreferenceTemplate(userName, preferences) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; margin-top: 20px; }
          .item { padding: 10px; border-bottom: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>✓ Preferences Updated Successfully</h2>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Your alert preferences have been updated:</p>
            <div class="item">
              <strong>Categories:</strong> ${preferences.categories.join(', ')}
            </div>
            <div class="item">
              <strong>Frequency:</strong> ${preferences.frequency}
            </div>
            <div class="item">
              <strong>Notification Methods:</strong> 
              ${preferences.notificationMethods.email ? 'Email ' : ''}
              ${preferences.notificationMethods.push ? 'Push' : ''}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
