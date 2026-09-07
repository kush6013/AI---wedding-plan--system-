// Video Plan Routes - defines API endpoints for saved video plan operations
const express = require('express');
const router = express.Router();
const { deleteVideoPlan } = require('../controllers/videoPlanController');

// DELETE /api/video-plans/:id - Delete a saved video plan
router.delete('/:id', deleteVideoPlan);

module.exports = router;