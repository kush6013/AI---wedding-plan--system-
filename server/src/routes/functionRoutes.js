// Function Routes - defines API endpoints for wedding function operations
const express = require('express');
const router = express.Router();
const {
  createFunction,
  getFunctionById,
  updateFunction,
  deleteFunction,
} = require('../controllers/functionController');

// POST /api/functions - Create a new function
router.post('/', createFunction);

// GET /api/functions/:id - Get a single function
router.get('/:id', getFunctionById);

// PUT /api/functions/:id - Update a function
router.put('/:id', updateFunction);

// DELETE /api/functions/:id - Delete a function
router.delete('/:id', deleteFunction);

module.exports = router;
