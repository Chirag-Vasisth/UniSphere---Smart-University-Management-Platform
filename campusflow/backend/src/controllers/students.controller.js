const studentsService = require('../services/students.service');
const marksService = require('../services/marks.service');

/**
 * GET /api/students
 * Admin: Retrieve all students with optional search
 */
const getAllStudents = async (req, res, next) => {
  try {
    const { search } = req.query;
    const students = await studentsService.getAllStudents(search);
    return res.status(200).json(students);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to retrieve students list'
    });
  }
};

/**
 * GET /api/students/:id
 * Admin: Retrieve single student details and their marks
 */
const getStudentById = async (req, res, next) => {
  try {
    const student = await studentsService.getStudentById(req.params.id);
    return res.status(200).json(student);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to retrieve student details'
    });
  }
};

/**
 * POST /api/students
 * Admin: Create new student
 */
const createStudent = async (req, res, next) => {
  try {
    const newStudent = await studentsService.createStudent(req.body);
    return res.status(201).json({
      status: 'ok',
      message: 'Student enrolled successfully',
      data: newStudent
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to enroll student'
    });
  }
};

/**
 * PUT /api/students/:id
 * Admin: Update student details
 */
const updateStudent = async (req, res, next) => {
  try {
    const updated = await studentsService.updateStudent(req.params.id, req.body);
    return res.status(200).json({
      status: 'ok',
      message: 'Student updated successfully',
      data: updated
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to update student'
    });
  }
};

/**
 * DELETE /api/students/:id
 * Admin: Delete student
 */
const deleteStudent = async (req, res, next) => {
  try {
    const result = await studentsService.deleteStudent(req.params.id, req.user.id);
    return res.status(200).json({
      status: 'ok',
      message: result.message
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to delete student'
    });
  }
};

/**
 * GET /api/students/:id/marks
 * Admin: View student's marks
 */
const getStudentMarks = async (req, res, next) => {
  try {
    const marks = await marksService.getMarksByStudentId(req.params.id);
    return res.status(200).json(marks);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to retrieve student marks'
    });
  }
};

/**
 * POST /api/students/:id/marks
 * Admin: Add mark record for a student
 */
const addStudentMark = async (req, res, next) => {
  try {
    const newMark = await marksService.addMark(req.params.id, req.body);
    return res.status(201).json({
      status: 'ok',
      message: 'Mark entry added successfully',
      data: newMark
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to add marks entry'
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentMarks,
  addStudentMark
};
