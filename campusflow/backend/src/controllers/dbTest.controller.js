const db = require('../config/database');

/**
 * Controller to test PostgreSQL database connection
 * GET /api/db-test
 */
const testDatabaseConnection = async (req, res) => {
  try {
    // Run a basic test query to confirm PostgreSQL connectivity
    await db.query('SELECT 1;');
    return res.status(200).json({
      status: 'ok',
      message: 'Database connection successful'
    });
  } catch (error) {
    // Log actual error on the server console for debugging,
    // but do not expose database credentials or internal stack to the client
    console.error('Database connection test failed:', error.message);
    return res.status(503).json({
      status: 'error',
      message: 'Database connection failed'
    });
  }
};

module.exports = {
  testDatabaseConnection
};
