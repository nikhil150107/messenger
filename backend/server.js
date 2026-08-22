require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const authRouter = require('./routes/authRoutes');
const homeRouter = require('./routes/homeRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// ⚡ PrivGuard Autonomous DPDPA Compliance & Telemetry Middleware (Must be before routes)
app.use(require('./middleware/privguard-middleware')({
    serviceName: 'messenger-backend',
    fiduciaryName: 'Messenger Technologies Pvt. Ltd.',
    privguardUrl: process.env.PRIVGUARD_URL || 'http://localhost:5000'
}));

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok', app: 'messenger-backend', version: '1.0.0' }));

app.use('/api/auth', authRouter);
app.use('/api/dashboard', homeRouter);

app.listen(PORT, () => {
    console.log(`[Messenger] Backend running on http://localhost:${PORT}`);
});