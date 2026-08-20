require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const authRouter = require('./routes/authRoutes');
const homeRouter = require('./routes/homeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use('/api/auth', authRouter);
app.use('/api/dashboard', homeRouter);

app.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
});
