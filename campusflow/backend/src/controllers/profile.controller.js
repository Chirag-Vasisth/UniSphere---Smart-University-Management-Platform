const profileService = require('../services/profile.service');

/**
 * GET /api/profile
 * Retrieve authenticated student profile
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profile = await profileService.getProfile(userId);

    return res.status(200).json({
      status: 'ok',
      data: profile
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to fetch student profile'
    });
  }
};

/**
 * PUT /api/profile
 * Update authenticated student profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, phone, course, department, year } = req.body;

    const updated = await profileService.updateProfile(userId, {
      name,
      phone,
      course,
      department,
      year
    });

    return res.status(200).json({
      status: 'ok',
      message: 'Profile updated successfully',
      data: updated
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to update student profile'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
