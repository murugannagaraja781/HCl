require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/applications', require('./routes/application.routes'));

// Simple Auth Stub
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    const users = {
        'admin': { id: 1, name: 'Admin User', role: 'ADMIN' },
        'm1': { id: 2, name: 'Manager One', role: 'MANAGER1' },
        'm2': { id: 3, name: 'Manager Two', role: 'MANAGER2' }
    };

    const user = users[username.toLowerCase()];
    if (user && password === 'Admin@2026') {
        res.json({ success: true, user });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.get('/health', (req, res) => res.send('Backend is running...'));

const PORT = process.env.PORT || 10000; // Render default

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
