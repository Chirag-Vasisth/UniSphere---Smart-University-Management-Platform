const express = require('express');
const router = express.Router();
const { testDatabaseConnection } = require('../controllers/dbTest.controller');

// GET /api/db-test
router.get('/', testDatabaseConnection);

module.exports = router;
