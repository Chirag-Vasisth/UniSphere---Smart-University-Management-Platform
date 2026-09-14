const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/students.controller');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');

// All student management endpoints are Admin-only
router.use(verifyToken, authorizeRoles('ADMIN'));

router.get('/', studentsController.getAllStudents);
router.get('/:id', studentsController.getStudentById);
router.post('/', studentsController.createStudent);
router.put('/:id', studentsController.updateStudent);
router.delete('/:id', studentsController.deleteStudent);

// Student marks management (Admin)
router.get('/:id/marks', studentsController.getStudentMarks);
router.post('/:id/marks', studentsController.addStudentMark);

module.exports = router;
