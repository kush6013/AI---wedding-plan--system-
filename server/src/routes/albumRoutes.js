// Album Routes - defines API endpoints for album design operations
const express = require('express');
const router = express.Router();
const { getAlbumDesignById, deleteAlbumDesign } = require('../controllers/albumController');

// GET /api/albums/:id - Get a single album design
router.get('/:id', getAlbumDesignById);

// DELETE /api/albums/:id - Delete an album design
router.delete('/:id', deleteAlbumDesign);

module.exports = router;
