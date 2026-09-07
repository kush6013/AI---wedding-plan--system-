// Wedding Controller - handles all wedding CRUD operations
// CRUD = Create, Read, Update, Delete

const Wedding = require('../models/Wedding');
const Function = require('../models/Function');
const VideoPlan = require('../models/VideoPlan');
const AlbumDesign = require('../models/AlbumDesign');

// POST /api/weddings - Create a new wedding
const createWedding = async (req, res) => {
  try {
    const {
      clientName,
      email,
      phone,
      coupleName,
      weddingDate,
      weddingLocation,
      weddingCity,
      weddingDescription,
      weddingTheme,
      guestCount,
    } = req.body;

    // Validate required fields
    if (!clientName || !email || !coupleName || !weddingDate || !weddingLocation) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: clientName, email, coupleName, weddingDate, weddingLocation',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Create wedding document in MongoDB
    const wedding = await Wedding.create({
      clientName,
      email,
      phone,
      coupleName,
      weddingDate,
      weddingLocation,
      weddingCity,
      weddingDescription,
      weddingTheme,
      guestCount,
    });

    res.status(201).json({
      success: true,
      message: 'Wedding created successfully',
      data: wedding,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/weddings - Get all weddings
const getAllWeddings = async (req, res) => {
  try {
    // Find all weddings and sort by newest first
    // Populate the functions array with actual function data
    const weddings = await Wedding.find({})
      .populate('functions')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Weddings retrieved successfully',
      data: weddings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/weddings/:id - Get a single wedding by ID
const getWeddingById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wedding ID format',
      });
    }

    // Find wedding and populate its functions with actual data
    const wedding = await Wedding.findById(id).populate('functions');

    if (!wedding) {
      return res.status(404).json({
        success: false,
        message: 'Wedding not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Wedding retrieved successfully',
      data: wedding,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/weddings/:id - Update a wedding
const updateWedding = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wedding ID format',
      });
    }

    const wedding = await Wedding.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update against schema
    });

    if (!wedding) {
      return res.status(404).json({
        success: false,
        message: 'Wedding not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Wedding updated successfully',
      data: wedding,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/weddings/:id - Delete a wedding and all related data
const deleteWedding = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wedding ID format',
      });
    }

    const wedding = await Wedding.findById(id);

    if (!wedding) {
      return res.status(404).json({
        success: false,
        message: 'Wedding not found',
      });
    }

    // Delete all related data (functions, video plans, album designs)
    await Function.deleteMany({ wedding: id });
    await VideoPlan.deleteMany({ wedding: id });
    await AlbumDesign.deleteMany({ wedding: id });

    // Delete the wedding itself
    await Wedding.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Wedding and all related data deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/weddings/:weddingId/functions - Get all functions for a wedding
const getWeddingFunctions = async (req, res) => {
  try {
    const { weddingId } = req.params;

    if (!weddingId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wedding ID format',
      });
    }

    const functions = await Function.find({ wedding: weddingId }).sort({
      date: 1,
    });

    res.status(200).json({
      success: true,
      message: 'Functions retrieved successfully',
      data: functions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/weddings/:weddingId/video-plans - Get all video plans for a wedding
const getWeddingVideoPlans = async (req, res) => {
  try {
    const { weddingId } = req.params;

    if (!weddingId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wedding ID format',
      });
    }

    const plans = await VideoPlan.find({ wedding: weddingId })
      .populate('function')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Video plans retrieved successfully',
      data: plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/weddings/:weddingId/album-designs - Get all album designs for a wedding
const getWeddingAlbumDesigns = async (req, res) => {
  try {
    const { weddingId } = req.params;

    if (!weddingId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wedding ID format',
      });
    }

    const designs = await AlbumDesign.find({ wedding: weddingId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: 'Album designs retrieved successfully',
      data: designs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createWedding,
  getAllWeddings,
  getWeddingById,
  updateWedding,
  deleteWedding,
  getWeddingFunctions,
  getWeddingVideoPlans,
  getWeddingAlbumDesigns,
};
