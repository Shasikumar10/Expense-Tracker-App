# Backend Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend directory (copy from `.env.example`):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/expense-tracker
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/expense-tracker

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

**Important:** 
- Replace `your_jwt_secret_key_here_change_this_in_production` with a secure random string
- If using MongoDB Atlas, update the `MONGODB_URI` with your connection string

### 3. Start MongoDB
If using local MongoDB:
```bash
# On Windows
net start MongoDB

# On Mac/Linux
sudo systemctl start mongod
```

### 4. Start the Backend Server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Expenses
- `GET /api/expenses` - Get all expenses (Protected)
- `GET /api/expenses/:id` - Get single expense (Protected)
- `POST /api/expenses` - Create expense (Protected)
- `PUT /api/expenses/:id` - Update expense (Protected)
- `DELETE /api/expenses/:id` - Delete expense (Protected)
- `GET /api/expenses/stats` - Get expense statistics (Protected)

### Users
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)
- `DELETE /api/users/profile` - Delete user account (Protected)

### Health Check
- `GET /api/health` - Check if API is running

## Testing the API

You can test the API using tools like:
- Postman
- Thunder Client (VS Code extension)
- cURL

Example registration request:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "currency": "USD"
  }'
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your connection string in `.env`
- Verify network access if using MongoDB Atlas

### Port Already in Use
- Change the PORT in `.env` file
- Or kill the process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill -9
  ```

### JWT Errors
- Ensure JWT_SECRET is set in `.env`
- Check token format in Authorization header: `Bearer <token>`

## Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User model
│   │   └── Expense.js         # Expense model
│   ├── controllers/
│   │   ├── authController.js   # Auth logic
│   │   ├── expenseController.js # Expense logic
│   │   └── userController.js   # User logic
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   ├── expenses.js        # Expense routes
│   │   └── users.js           # User routes
│   └── middleware/
│       └── auth.js            # JWT authentication
├── server.js                   # Entry point
├── .env                        # Environment variables
├── .env.example               # Environment template
├── .gitignore
└── package.json
```
