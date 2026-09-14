const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Middleware to verify JWT authentication token from request header
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied. No authentication token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded; // { id, email, role, name, iat, exp }
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired authentication token.'
    });
  }
};

/**
 * Role-based authorization guard
 * @param  {...string} allowedRoles - e.g. 'ADMIN', 'STUDENT'
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access forbidden: insufficient role permissions.'
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoles
};
