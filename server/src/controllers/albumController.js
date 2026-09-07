// Album Controller - handles album design retrieval
// Album designs are created via the aiController

const AlbumDesign = require('../models/AlbumDesign');

// GET /api/albums/:id - Get a single album design
const getAlbumDesignById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid album design ID format',
      });
    }

    const design = await AlbumDesign.findById(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Album design not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Album design retrieved successfully',
      data: design,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/albums/:id - Delete an album design
const deleteAlbumDesign = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid album design ID format',
      });
    }

    const design = await AlbumDesign.findByIdAndDelete(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Album design not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Album design deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getAlbumDesignById, deleteAlbumDesign };
