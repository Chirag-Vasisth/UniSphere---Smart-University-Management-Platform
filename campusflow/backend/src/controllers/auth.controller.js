const authService = require('../services/auth.service');

/**
 * Handle student registration
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, course, department, year } = req.body;

    const result = await authService.register({
      name,
      email,
      password,
      confirmPassword,
      course,
      department,
      year
    });

    return res.status(201).json({
      status: 'ok',
      message: 'Student registered successfully',
      data: result
    });
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({
        status: 'error',
        message: 'Database connection failed. Please verify that PostgreSQL is running.'
      });
    }

    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Registration failed'
    });
  }
};

/**
 * Handle user authentication
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    return res.status(200).json({
      status: 'ok',
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({
        status: 'error',
        message: 'Database connection failed. Please verify that PostgreSQL is running.'
      });
    }

    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Login failed'
    });
  }
};

/**
 * Retrieve authenticated session user profile
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await authService.getMe(userId);

    return res.status(200).json({
      status: 'ok',
      data: result
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to retrieve profile'
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};
