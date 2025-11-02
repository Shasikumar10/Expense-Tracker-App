# 💰 Expense Tracker App

A comprehensive full-stack mobile application for tracking expenses, managing budgets, recording income, and generating detailed financial reports. Built with React Native (Expo) for the frontend and Node.js/Express with MongoDB for the backend.

## 📱 Features

### Core Features
- ✅ **User Authentication** - Secure registration and login with JWT
- ✅ **Google OAuth** - Sign in with Google account
- ✅ **Enhanced UI/UX** - Modern interface with real-time validation
- ✅ **Expense Management** - Add, view, edit, and delete expenses
- ✅ **Multi-Category Support** - 14+ expense categories
- ✅ **Multiple Payment Methods** - Cash, Credit Card, Debit Card, Bank Transfer, Digital Wallet
- ✅ **Multi-Currency Support** - 50+ world currencies (USD, EUR, GBP, INR, JPY, AUD, CAD, and more)

### Advanced Features
- 💼 **Budget Management** - Set monthly/weekly/yearly budgets per category with alert thresholds
- 💵 **Income Tracking** - Record income from multiple sources with recurring income support
- 🔄 **Recurring Expenses** - Automate regular expenses (subscriptions, rent, bills)
- 📊 **Financial Reports & Analytics**
  - Financial summary (income, expenses, net savings, savings rate)
  - Monthly comparison (last 6 months)
  - Category analysis with spending patterns
  - Top categories and payment methods
  - Export data to CSV
- 📈 **Statistics Dashboard** - Visual breakdown of spending by category

## 🏗️ Tech Stack

### Frontend
- **React Native** with Expo SDK 54
- **React Navigation** (Stack & Bottom Tabs)
- **Axios** for API calls
- **AsyncStorage** for local data persistence
- **React Context API** for state management
- **expo-web-browser** for OAuth authentication
- **@react-native-picker/picker** for currency selection
- **Real-time form validation** with error messages

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Passport.js** with Google OAuth 2.0 strategy
- **bcryptjs** for password hashing
- **express-session** for session management
- **CORS** enabled

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Expo CLI (`npm install -g expo-cli`)
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/Shasikumar10/Expense-Tracker-App.git
cd Expense-Tracker-App/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:19000

# Session Configuration
SESSION_SECRET=your_session_secret_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://YOUR_IP:5000/api/auth/google/callback
```

**Note**: For Google OAuth setup instructions, see [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)

4. **Start the backend server**
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Update API URL**

Edit `frontend/src/constants/index.js`:

```javascript
export const API_URL = 'http://localhost:5000/api';
// For Android emulator: http://10.0.2.2:5000/api
// For physical device: http://YOUR_COMPUTER_IP:5000/api
```

4. **Start Expo**
```bash
npm start
```

5. **Run on device**
- Scan QR code with Expo Go app (iOS/Android)
- Press `a` for Android emulator
- Press `i` for iOS simulator (Mac only)

## 📱 App Screens

### Authentication
- **Login Screen** - User login with email/password
- **Register Screen** - New user registration with currency selection

### Main Tabs
1. **Home (Expenses)** - View all expenses, add new expense, delete expenses
2. **Budgets** - View budget progress, create/delete budgets, budget overview
3. **Income** - Track income sources, add income, view income statistics
4. **Stats** - Category-wise expense breakdown with visual charts
5. **Profile** - User profile, access to recurring expenses and reports

### Additional Screens
- **Expense Detail** - Detailed view of individual expense
- **Add Expense** - Create new expense with categories, payment methods
- **Add Budget** - Set budget per category with alert thresholds
- **Add Income** - Record income with recurring options
- **Recurring Expenses** - Manage subscriptions and recurring bills
- **Reports** - Comprehensive financial analytics and export

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Initialize Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/google/error` - Google OAuth error handler

### Expenses
- `GET /api/expenses` - Get all expenses (with filters)
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats` - Get expense statistics

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `DELETE /api/budgets/:id` - Delete budget
- `GET /api/budgets/overview` - Get budget overview

### Income
- `GET /api/income` - Get all income
- `POST /api/income` - Create income
- `DELETE /api/income/:id` - Delete income
- `GET /api/income/stats` - Get income statistics

### Recurring Expenses
- `GET /api/recurring-expenses` - Get all recurring expenses
- `POST /api/recurring-expenses` - Create recurring expense
- `DELETE /api/recurring-expenses/:id` - Delete recurring expense
- `POST /api/recurring-expenses/process` - Process due recurring expenses
- `GET /api/recurring-expenses/upcoming` - Get upcoming recurring expenses

### Reports
- `GET /api/reports/financial-summary` - Get financial summary
- `GET /api/reports/monthly-comparison` - Get monthly comparison
- `GET /api/reports/category-analysis` - Get category analysis
- `GET /api/reports/spending-patterns` - Get spending patterns
- `GET /api/reports/export` - Export data to CSV

## 🎨 Categories & Options

### Expense Categories
Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Healthcare, Education, Travel, Personal Care, Groceries, Housing, Insurance, Investments, Other

### Income Categories
Salary, Freelance, Business, Investment, Rental, Gift, Bonus, Refund, Other

### Payment Methods
Cash, Credit Card, Debit Card, Bank Transfer, Digital Wallet, Other

### Recurring Frequencies
Daily, Weekly, Biweekly, Monthly, Quarterly, Yearly

### Budget Periods
Weekly, Monthly, Yearly

## 🔒 Security Features

- JWT-based authentication with 7-day expiry
- Google OAuth 2.0 integration
- Password hashing with bcryptjs (10 rounds)
- Protected API routes with middleware
- Input validation and sanitization
- Real-time form validation on frontend
- Password visibility toggle for better UX
- CORS configuration
- Session management
- Environment variable protection

## ✨ Recent Improvements

### UI/UX Enhancements
- ✅ Enhanced RegisterScreen with better validation
- ✅ Enhanced LoginScreen with improved error handling
- ✅ Password visibility toggle on both auth screens
- ✅ Real-time form validation with error messages
- ✅ Loading states with activity indicators
- ✅ Google Sign-In button integration
- ✅ 50+ world currencies support
- ✅ Improved currency picker layout

### Backend Improvements
- ✅ Google OAuth authentication with Passport.js
- ✅ Session management for OAuth
- ✅ Enhanced User model with Google ID
- ✅ Improved error handling
- ✅ API URL configuration for mobile devices

### Bug Fixes
- ✅ Fixed currency picker overlap issue
- ✅ Fixed API connectivity for mobile devices
- ✅ Fixed authentication type safety issues
- ✅ Added proper error messages throughout the app

## 📝 Project Structure
```
Expense-Tracker/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # Mongoose models
│   │   └── routes/          # API routes
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── constants/       # App constants
    │   ├── context/         # Auth context
    │   ├── navigation/      # Navigation setup
    │   ├── screens/         # All app screens
    │   └── services/        # API services
    ├── App.js
    └── package.json
```

## 👨‍💻 Author

**Shasikumar**
- GitHub: [@Shasikumar10](https://github.com/Shasikumar10)

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ using React Native and Node.js
