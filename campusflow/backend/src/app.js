const express = require('express');
const cors = require('cors');
const config = require('./config');
const requestLogger = require('./middleware/logger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// Route imports
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const studentsRoutes = require('./routes/students.routes');
const marksRoutes = require('./routes/marks.routes');
const profileRoutes = require('./routes/profile.routes');
const adminRoutes = require('./routes/admin.routes');
const dbTestRoutes = require('./routes/dbTest.routes');

const app = express();

// Global Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Base API route greeting
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to CampusFlow API',
    documentation: '/api/health',
    version: '1.0.0'
  });
});

// Mount Routes
app.use('/api/health', healthRoutes);
app.use('/api/db-test', dbTestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all 404 handler
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
