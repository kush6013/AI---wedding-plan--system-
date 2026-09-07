// Function Controller - handles CRUD operations for wedding functions
// Functions are individual events: Haldi, Mehendi, Sangeet, Wedding, Reception

const Function = require('../models/Function');
const Wedding = require('../models/Wedding');

// POST /api/functions - Create a new function for a wedding
const createFunction = async (req, res) => {
  try {
    const {
      wedding,
      functionName,
      date,
      startTime,
      endTime,
      venue,
      description,
      importance,
    } = req.body;

    // Validate required fields
    if (!wedding || !functionName || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide wedding ID, function name, and date',
      });
    }

    // Validate wedding ID format
    if (!wedding.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wedding ID format',
      });
    }

    // Check if the wedding exists
    const existingWedding = await Wedding.findById(wedding);
    if (!existingWedding) {
      return res.status(404).json({
        success: false,
        message: 'Wedding not found',
      });
    }

    // Create the function
    const newFunction = await Function.create({
      wedding,
      functionName,
      date,
      startTime,
      endTime,
      venue,
      description,
      importance,
    });

    // Add the function reference to the wedding's functions array
    existingWedding.functions.push(newFunction._id);
    await existingWedding.save();

    res.status(201).json({
      success: true,
      message: 'Function created successfully',
      data: newFunction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/functions/:id - Get a single function
const getFunctionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid function ID format',
      });
    }

    const func = await Function.findById(id);

    if (!func) {
      return res.status(404).json({
        success: false,
        message: 'Function not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Function retrieved successfully',
      data: func,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/functions/:id - Update a function
const updateFunction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid function ID format',
      });
    }

    const func = await Function.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!func) {
      return res.status(404).json({
        success: false,
        message: 'Function not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Function updated successfully',
      data: func,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/functions/:id - Delete a function
const deleteFunction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid function ID format',
      });
    }

    const func = await Function.findById(id);

    if (!func) {
      return res.status(404).json({
        success: false,
        message: 'Function not found',
      });
    }

    // Remove function reference from the parent wedding
    await Wedding.findByIdAndUpdate(func.wedding, {
      $pull: { functions: func._id },
    });

    await Function.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Function deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createFunction,
  getFunctionById,
  updateFunction,
  deleteFunction,
};
