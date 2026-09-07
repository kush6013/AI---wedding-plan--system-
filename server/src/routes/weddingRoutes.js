// Wedding Routes - defines API endpoints for wedding operations
const express = require('express');
const router = express.Router();
const {
  createWedding,
  getAllWeddings,
  getWeddingById,
  updateWedding,
  deleteWedding,
  getWeddingFunctions,
  getWeddingVideoPlans,
  getWeddingAlbumDesigns,
} = require('../controllers/weddingController');

// POST /api/weddings - Create new wedding
router.post('/', createWedding);

// GET /api/weddings - Get all weddings
router.get('/', getAllWeddings);

// GET /api/weddings/:id - Get single wedding
router.get('/:id', getWeddingById);

// PUT /api/weddings/:id - Update wedding
router.put('/:id', updateWedding);

// DELETE /api/weddings/:id - Delete wedding
router.delete('/:id', deleteWedding);

// GET /api/weddings/:weddingId/functions - Get functions for a wedding
router.get('/:weddingId/functions', getWeddingFunctions);

// GET /api/weddings/:weddingId/video-plans - Get video plans for a wedding
router.get('/:weddingId/video-plans', getWeddingVideoPlans);

// GET /api/weddings/:weddingId/album-designs - Get album designs for a wedding
router.get('/:weddingId/album-designs', getWeddingAlbumDesigns);

module.exports = router;
