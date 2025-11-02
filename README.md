# Expense-Tracker-App

A full-stack expense tracking mobile application built with Node.js/Express backend and React Native frontend.

## Features
- Add, edit, and delete expenses
- Track expenses by category
- View expense history
- Filter and search expenses
- User authentication
- MongoDB database integration
- Cross-platform mobile app (iOS & Android)

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

### Frontend (Mobile)
- React Native
- Expo
- Axios for API calls
- React Navigation
- Modern mobile UI components

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

#### Backend Setup
```bash
cd backend
npm install
# Create .env file with your configurations (copy from .env.example)
npm start
```

#### Frontend Setup (Mobile)
```bash
cd frontend
npm install
npx expo start
# Scan QR code with Expo Go app on your mobile device
# Or press 'a' for Android emulator or 'i' for iOS simulator
```

## Project Structure
```
Expense-Tracker/
├── backend/          # Backend API
│   ├── src/
│   │   ├── config/   # Configuration files
│   │   ├── models/   # Database models
│   │   ├── routes/   # API routes
│   │   ├── controllers/ # Route controllers
│   │   └── middleware/  # Custom middleware
│   ├── server.js     # Entry point
│   └── package.json
└── frontend/         # React Native Mobile App
    ├── src/
    │   ├── components/
    │   ├── screens/
    │   ├── services/
    │   ├── navigation/
    │   └── context/
    ├── App.js
    └── package.json
```

## License
MIT
