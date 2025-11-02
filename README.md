# Expense-Tracker-App

A full-stack expense tracking application built with Node.js/Express backend and React frontend.

## Features
- Add, edit, and delete expenses
- Track expenses by category
- View expense history
- Filter and search expenses
- User authentication
- MongoDB database integration

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React
- Axios for API calls
- React Router
- Modern UI components

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
# Create .env file with your configurations
npm start
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
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
└── frontend/         # React frontend
    ├── src/
    │   ├── components/
    │   ├── services/
    │   └── App.js
    └── package.json
```

## License
MIT
