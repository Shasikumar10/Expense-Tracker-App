const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send login notification email
const sendLoginNotification = async (user, loginDetails) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🔐 New Login Detected - Expense Tracker',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #667eea; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Login Alert</h1>
              <p>A new login was detected on your account</p>
            </div>
            <div class="content">
              <p>Hello <strong>${user.name}</strong>,</p>
              <p>We detected a new login to your Expense Tracker account. If this was you, you can safely ignore this email.</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #667eea;">Login Details</h3>
                <div class="info-row">
                  <span class="label">📧 Email:</span> ${user.email}
                </div>
                <div class="info-row">
                  <span class="label">💰 Currency:</span> ${user.currency}
                </div>
                <div class="info-row">
                  <span class="label">⏰ Time:</span> ${new Date().toLocaleString()}
                </div>
                <div class="info-row">
                  <span class="label">🌐 IP Address:</span> ${loginDetails.ipAddress || 'Unknown'}
                </div>
                <div class="info-row">
                  <span class="label">📱 Device:</span> ${loginDetails.userAgent || 'Unknown'}
                </div>
              </div>

              <p><strong>Wasn't you?</strong></p>
              <p>If you didn't log in, please change your password immediately and contact support.</p>
              
              <div style="text-align: center;">
                <a href="${process.env.CLIENT_URL || 'exp://192.168.1.9:8081'}" class="button">
                  Open App
                </a>
              </div>

              <div class="footer">
                <p>This is an automated security notification from Expense Tracker.</p>
                <p>© ${new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Login notification sent to ${user.email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending login email:', error);
    // Don't fail the login if email fails
    return { success: false, error: error.message };
  }
};

// Send welcome email for new registrations
const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🎉 Welcome to Expense Tracker!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome Aboard!</h1>
              <p>Start your journey to better financial management</p>
            </div>
            <div class="content">
              <p>Hello <strong>${user.name}</strong>,</p>
              <p>Thank you for joining Expense Tracker! We're excited to help you manage your finances better.</p>
              
              <h3 style="color: #667eea;">✨ What you can do:</h3>
              <div class="feature">💸 Track all your expenses and income</div>
              <div class="feature">📊 Set budgets and monitor spending</div>
              <div class="feature">🔄 Manage recurring expenses</div>
              <div class="feature">📈 View detailed financial reports</div>
              <div class="feature">💰 Support for 50+ currencies</div>
              
              <p style="margin-top: 30px;">Your account has been set up with <strong>${user.currency}</strong> as your default currency.</p>

              <div class="footer">
                <p>Happy tracking! 🚀</p>
                <p>© ${new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${user.email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email (for future use)
const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🔑 Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendLoginNotification,
  sendWelcomeEmail,
  sendPasswordResetEmail
};
