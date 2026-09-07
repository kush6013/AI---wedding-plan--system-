// AI Routes - defines API endpoints for AI generation
const express = require('express');
const router = express.Router();
const {
  generateFunctionVideoPlan,
  generateHighlightVideoPlan,
  generateAlbumDesign,
} = require('../controllers/aiController');

// POST /api/ai/function-video-plan - Generate function-wise video plan
router.post('/function-video-plan', generateFunctionVideoPlan);

// POST /api/ai/highlight-video-plan - Generate overall highlight video plan
router.post('/highlight-video-plan', generateHighlightVideoPlan);

// POST /api/ai/album-design - Generate album design suggestions
router.post('/album-design', generateAlbumDesign);

module.exports = router;
