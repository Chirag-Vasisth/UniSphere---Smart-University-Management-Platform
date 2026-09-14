const express = require('express');
const router = express.Router();
const marksController = require('../controllers/marks.controller');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');

// GET /api/marks -> Student views their own marks
router.get('/', verifyToken, marksController.getMyMarks);

// Admin-only mark manipulation endpoints
router.put('/:id', verifyToken, authorizeRoles('ADMIN'), marksController.updateMark);
router.delete('/:id', verifyToken, authorizeRoles('ADMIN'), marksController.deleteMark);

module.exports = router;
