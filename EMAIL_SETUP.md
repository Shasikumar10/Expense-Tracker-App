# Email Notification Setup Guide

## Overview
The Expense Tracker now sends email notifications for:
- ✅ Login alerts (with device and location info)
- ✅ Welcome emails for new registrations
- ✅ Password reset requests (future feature)

## Setup Instructions

### Option 1: Gmail (Recommended for Testing)

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** (left sidebar)
3. Under "Signing in to Google", enable **2-Step Verification**
4. Follow the prompts to set it up

#### Step 2: Generate App Password
1. After enabling 2FA, go to: https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other** (type "Expense Tracker")
4. Click **Generate**
5. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)

#### Step 3: Update .env File
Open `backend/.env` and update:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM_NAME=Expense Tracker
```

**Important**: Use the App Password (16 characters), NOT your regular Gmail password!

---

### Option 2: Other Email Providers

#### Outlook/Hotmail
```env
EMAIL_SERVICE=hotmail
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

#### Yahoo Mail
```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-password
```

#### Custom SMTP Server
```env
EMAIL_SERVICE=
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASSWORD=your-password
```

---

## Testing Email Notifications

### 1. Test Registration Email
1. Create a new account in the app
2. Check your inbox for the welcome email
3. Subject: "🎉 Welcome to Expense Tracker!"

### 2. Test Login Email
1. Log in to an existing account
2. Check your inbox for the login alert
3. Subject: "🔐 New Login Detected - Expense Tracker"

---

## Email Templates

### Login Notification Includes:
- User's name and email
- Login timestamp
- IP address
- Device/User agent information
- Security message

### Welcome Email Includes:
- Personalized greeting
- Feature highlights
- Currency settings confirmation
- Getting started tips

---

## Troubleshooting

### "Authentication failed" error
**Problem**: Invalid credentials or app password not set

**Solutions**:
1. Make sure you're using an **App Password** (not regular password)
2. Remove spaces from the app password
3. Check EMAIL_USER is correct
4. For Gmail, ensure 2FA is enabled

### "Connection timeout" error
**Problem**: Unable to connect to email server

**Solutions**:
1. Check your internet connection
2. Verify EMAIL_SERVICE is correct ("gmail", "yahoo", etc.)
3. Check firewall settings
4. Try a different email provider

### Emails not received
**Problem**: Emails sent but not arriving

**Solutions**:
1. Check spam/junk folder
2. Add `your-email@gmail.com` to contacts
3. Check email server logs in terminal
4. Verify recipient email is correct

### "Less secure app" error (Gmail)
**Problem**: Gmail blocking login attempts

**Solution**:
- Use App Passwords instead (recommended)
- App Passwords require 2-Factor Authentication

---

## Security Best Practices

### 1. Use App Passwords
- Never use your main email password
- Generate unique app passwords for each application
- Revoke access anytime from your Google Account

### 2. Environment Variables
```bash
# Never commit .env to git
echo ".env" >> .gitignore

# Use different credentials for dev/prod
# Production .env should be on server only
```

### 3. Email Rate Limiting
The app automatically handles failed emails:
- Login/registration won't fail if email fails
- Errors are logged but don't block user actions
- Consider implementing rate limiting for production

---

## Production Recommendations

### 1. Use Professional Email Services
For production, consider using:
- **SendGrid** (12,000 free emails/month)
- **Mailgun** (5,000 free emails/month)
- **AWS SES** (Pay as you go, very cheap)
- **Postmark** (100 free emails/month)

### 2. SendGrid Example
```bash
npm install @sendgrid/mail
```

```env
SENDGRID_API_KEY=your-api-key
EMAIL_FROM=noreply@yourapp.com
```

### 3. Custom Domain
- Use a custom domain email (no-reply@yourapp.com)
- Improves deliverability
- Looks more professional
- Less likely to be marked as spam

---

## Email Features Implemented

✅ **Login Notifications**
- Sent on every successful login
- Includes security details
- Helps detect unauthorized access

✅ **Welcome Emails**
- Sent on registration
- Introduces app features
- Confirms account creation

🔜 **Future Enhancements**
- Password reset emails
- Budget alert emails
- Weekly/monthly spending summaries
- Expense reminders
- Export ready notifications

---

## Testing Without Real Emails

### Using Ethereal Email (Development)
For testing without sending real emails:

1. Go to https://ethereal.email/create
2. Get test credentials
3. Use in .env:
```env
EMAIL_SERVICE=
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your-ethereal-user
EMAIL_PASSWORD=your-ethereal-password
```

4. View sent emails at: https://ethereal.email/messages

---

## Support

For issues:
1. Check terminal logs for email errors
2. Verify .env configuration
3. Test with Ethereal Email first
4. Check email provider documentation

---

**Note**: Email notifications are optional. The app works fully even if emails fail to send.

## Quick Start

1. Enable Gmail 2FA
2. Generate App Password
3. Update .env file
4. Restart backend server
5. Test by logging in

Done! 🎉
