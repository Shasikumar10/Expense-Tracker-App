# Expense Tracker - Deployment Guide

This guide will help you deploy your Expense Tracker application to production.

## 📦 Deployment Options

### Backend Deployment (Render - FREE)
### Frontend Deployment (Expo EAS Build)

---

## 🚀 Backend Deployment to Render

### Step 1: Prepare Your Repository
Your code is already pushed to GitHub: `https://github.com/Shasikumar10/Expense-Tracker-App`

### Step 2: Create Render Account
1. Go to [https://render.com](https://render.com)
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### Step 3: Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `Expense-Tracker-App`
3. Configure the service:
   - **Name**: `expense-tracker-api`
   - **Environment**: `Node`
   - **Region**: Select closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### Step 4: Add Environment Variables
In Render dashboard, go to **Environment** tab and add:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
CLIENT_URL=https://expense-tracker-app.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-render-url.onrender.com/api/auth/google/callback
```

**Note**: Copy these values from your `backend/.env` file

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Your API will be available at: `https://expense-tracker-api.onrender.com`

### Step 6: Update Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   - `https://your-render-url.onrender.com/api/auth/google/callback`

---

## 📱 Frontend Deployment with Expo EAS

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo
```bash
eas login
```
(Create account at [expo.dev](https://expo.dev) if you don't have one)

### Step 3: Configure EAS Build
```bash
cd frontend
eas build:configure
```

### Step 4: Update API URL
In `frontend/src/services/api.js`, update the baseURL to your Render URL:

```javascript
const API_BASE_URL = 'https://expense-tracker-api.onrender.com/api';
```

### Step 5: Build for iOS
```bash
eas build --platform ios --profile production
```

### Step 6: Build for Android (APK)
```bash
eas build --platform android --profile production
```

### Step 7: Submit to App Stores (Optional)
```bash
# For iOS App Store
eas submit --platform ios

# For Google Play Store
eas submit --platform android
```

---

## 🔧 Alternative: Quick Testing Deployment

### Using Expo Go (No Build Required)
1. Update API URL in `frontend/src/services/api.js`:
   ```javascript
   const API_BASE_URL = 'https://expense-tracker-api.onrender.com/api';
   ```

2. Start Expo:
   ```bash
   cd frontend
   npx expo start
   ```

3. Scan QR code with Expo Go app on your phone

---

## ✅ Post-Deployment Checklist

### Backend
- [ ] API is accessible at Render URL
- [ ] MongoDB connection working
- [ ] All environment variables set
- [ ] Google OAuth callback URL updated
- [ ] Email notifications working

### Frontend
- [ ] API URL updated to Render URL
- [ ] App builds successfully
- [ ] Can register new user
- [ ] Can login with email
- [ ] Can add expenses
- [ ] Email notifications received
- [ ] All screens working

---

## 🐛 Troubleshooting

### Backend Issues
1. **500 Errors**: Check Render logs for errors
2. **MongoDB Connection**: Verify MONGODB_URI is correct
3. **CORS Errors**: Check CLIENT_URL in environment variables

### Frontend Issues
1. **Network Errors**: Verify API URL is correct
2. **Build Fails**: Check for missing dependencies
3. **OAuth Not Working**: Update callback URLs in Google Console

---

## 📊 Monitoring

### Render Dashboard
- View logs: `https://dashboard.render.com`
- Monitor CPU/Memory usage
- Check deployment status

### MongoDB Atlas
- Monitor database performance
- Check connection logs
- View database metrics

---

## 💰 Cost Estimate

### Free Tier (Current Setup)
- **Render**: Free (with auto-sleep after 15 min inactivity)
- **MongoDB Atlas**: Free (512 MB storage)
- **Expo**: Free for development builds

### Paid Plans (If Needed)
- **Render Starter**: $7/month (no sleep, custom domain)
- **MongoDB Atlas**: $9/month (shared cluster, 2GB)
- **Expo EAS**: $29/month (production builds)

---

## 🎉 You're Ready to Deploy!

Follow the steps above to deploy your Expense Tracker app to production.

For help: shashikumar44887@gmail.com
