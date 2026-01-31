const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// CSP Middleware
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; " +
        "font-src 'self' data: https://cdnjs.cloudflare.com https://hcl-ogs7.onrender.com; " +
        "img-src 'self' data: https://images.unsplash.com; " +
        "connect-src 'self' https://hcl-ogs7.onrender.com;"
    );
    next();
});

const path = require('path');

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cards', require('./routes/cardRoutes'));

// Welcome route for API
app.get('/api', (req, res) => {
    res.json({ message: "Welcome to HCL Credit Card API" });
});

// Serve Static Assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder (Vite uses 'dist', Create React App uses 'build')
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
} else {
    // Simple root route for development
    app.get('/', (req, res) => {
        res.send('Server is running... (In development mode)');
    });
}

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
