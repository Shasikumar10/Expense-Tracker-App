const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect DB
connectDB();

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/expenses', require('./src/routes/expenses'));

app.get('/', (req, res) => res.send({ ok: true, message: 'Expense Tracker backend running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
