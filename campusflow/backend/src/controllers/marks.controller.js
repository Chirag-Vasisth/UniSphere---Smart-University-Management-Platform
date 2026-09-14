const marksService = require('../services/marks.service');

/**
 * GET /api/marks
 * Retrieve academic marks for the logged-in student only
 */
const getMyMarks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const marks = await marksService.getStudentMarks(userId);

    return res.status(200).json(marks);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to fetch academic marks'
    });
  }
};

/**
 * PUT /api/marks/:id
 * Admin: Update an existing mark entry
 */
const updateMark = async (req, res, next) => {
  try {
    const markId = req.params.id;
    const { subject, marks } = req.body;

    const updated = await marksService.updateMark(markId, { subject, marks });

    return res.status(200).json({
      status: 'ok',
      message: 'Marks updated successfully',
      data: updated
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to update marks record'
    });
  }
};

/**
 * DELETE /api/marks/:id
 * Admin: Delete an existing mark entry
 */
const deleteMark = async (req, res, next) => {
  try {
    const markId = req.params.id;
    const result = await marksService.deleteMark(markId);

    return res.status(200).json({
      status: 'ok',
      message: result.message
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to delete marks record'
    });
  }
};

module.exports = {
  getMyMarks,
  updateMark,
  deleteMark
};
