# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Clone the Repository
```bash
git clone https://github.com/Shasikumar10/Expense-Tracker-App.git
cd Expense-Tracker-App
```

### Step 2: Setup Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Copy .env.example to .env and update the values
# Minimum required: MONGODB_URI and JWT_SECRET

# Start the server
npm start
```

Backend will run on: `http://localhost:5000`

### Step 3: Setup Frontend (Mobile App)
```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Update API_URL in src/constants/index.js
# For physical device: Use your computer's IP address
# For Android emulator: Use http://10.0.2.2:5000/api
# For iOS simulator: Use http://localhost:5000/api

# Start Expo
npx expo start
```

### Step 4: Run the App
1. Install **Expo Go** app on your phone (iOS/Android)
2. Scan the QR code from the terminal
3. App will load on your device!

## 📱 Using the App

### First Time Setup
1. **Register**: Create your account with email and password
2. **Login**: Sign in with your credentials
3. **Add Expense**: Tap the + button to add your first expense

### Main Features
- ➕ **Add Expenses**: Track spending with categories
- 📊 **View Statistics**: See spending breakdown by category
- 🔍 **Search & Filter**: Find expenses quickly
- 👤 **Profile**: Manage your account settings
- 🔒 **Secure**: JWT authentication

## 🛠️ Requirements

### Backend
- Node.js (v14+)
- MongoDB (local or Atlas)

### Frontend
- Node.js (v14+)
- Expo Go app (for mobile testing)
- OR Android Studio / Xcode (for emulator)

## 📖 Detailed Documentation

- [Backend Setup Guide](./backend/README.md)
- [Frontend Setup Guide](./frontend/README.md)
- [Main README](./README.md)

## 🐛 Common Issues

### Cannot connect to backend?
- Ensure backend is running on port 5000
- Check API_URL in frontend/src/constants/index.js
- Use your computer's IP address for physical devices

### MongoDB connection error?
- Ensure MongoDB is running
- Check MONGODB_URI in backend/.env
- For MongoDB Atlas, check network access settings

### Expo not loading?
- Clear cache: `npx expo start -c`
- Ensure device and computer are on same WiFi
- Check firewall settings

## 🎯 Next Steps

1. **Customize**: Update colors in `frontend/src/constants/index.js`
2. **Enhance**: Add new features like recurring expenses
3. **Deploy**: 
   - Backend: Deploy to Heroku, Railway, or AWS
   - Frontend: Build with `npx expo build:android` or `npx expo build:ios`

## 💡 Tips

- Use the statistics screen to track spending patterns
- Set up recurring expenses for subscriptions
- Filter expenses by date range for monthly reports
- Export data for tax purposes

## 🤝 Contributing

Feel free to fork this repository and submit pull requests!

## 📝 License

MIT License - Feel free to use this project for learning or commercial purposes.

---

**Happy Expense Tracking! 💰📱**
