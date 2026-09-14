const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');

// Protect all admin overview endpoints
router.use(verifyToken, authorizeRoles('ADMIN'));

// GET /api/admin/stats
router.get('/stats', adminController.getAdminStats);

module.exports = router;
