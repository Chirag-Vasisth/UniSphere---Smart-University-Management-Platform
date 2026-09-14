const adminService = require('../services/admin.service');

/**
 * GET /api/admin/stats
 * Admin-only: aggregated system statistics
 */
const getAdminStats = async (req, res, next) => {
  try {
    const stats = await adminService.getAdminStats();
    return res.status(200).json(stats);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to retrieve administrative statistics'
    });
  }
};

module.exports = {
  getAdminStats
};
