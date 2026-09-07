// AI Controller - handles AI generation endpoints
// These endpoints receive wedding data, send it to the AI provider (OpenRouter),
// store the result in MongoDB, and return it to the frontend

const Wedding = require('../models/Wedding');
const Function = require('../models/Function');
const VideoPlan = require('../models/VideoPlan');
const AlbumDesign = require('../models/AlbumDesign');
const { generateAIResponse } = require('../services/aiService');
const {
  buildFunctionVideoPlanPrompt,
  buildHighlightVideoPlanPrompt,
  buildAlbumDesignPrompt,
} = require('../utils/promptBuilder');

// POST /api/ai/function-video-plan
// Generates a video plan for a specific wedding function
const generateFunctionVideoPlan = async (req, res) => {
  try {
    const { weddingId, functionId } = req.body;

    // Validate required fields
    if (!weddingId || !functionId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both weddingId and functionId',
      });
    }

    // Validate ObjectId formats
    if (!weddingId.match(/^[0-9a-fA-F]{24}$/) || !functionId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    // Fetch wedding and function data from database
    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res.status(404).json({
        success: false,
        message: 'Wedding not found',
      });
    }

    const func = await Function.findById(functionId);
    if (!func) {
      return res.status(404).json({
        success: false,
        message: 'Function not found',
      });
    }

    // Build the prompt using wedding and function data
    const prompt = buildFunctionVideoPlanPrompt(wedding, func);

    // Send prompt to AI and get structured response
    const aiOutput = await generateAIResponse(prompt);

    // Save the generated plan in MongoDB
    const videoPlan = await VideoPlan.create({
      wedding: weddingId,
      function: functionId,
      planType: 'function-video',
      aiOutput,
    });

    res.status(201).json({
      success: true,
      message: 'Function video plan generated successfully',
      data: videoPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate function video plan',
    });
  }
};

// POST /api/ai/highlight-video-plan
// Generates an overall wedding highlight video plan
const generateHighlightVideoPlan = async (req, res) => {
  try {
    const { weddingId } = req.body;

    if (!weddingId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide weddingId',
      });
    }

    if (!weddingId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wedding ID format',
      });
    }

    // Fetch wedding with all its functions
    const wedding = await Wedding.findById(weddingId).populate('functions');
    if (!wedding) {
      return res.status(404).json({
        success: false,
        message: 'Wedding not found',
      });
    }

    // Build prompt with wedding details and all functions
    const prompt = buildHighlightVideoPlanPrompt(wedding, wedding.functions);

    // Get AI response
    const aiOutput = await generateAIResponse(prompt);

    // Save the highlight plan
    const videoPlan = await VideoPlan.create({
      wedding: weddingId,
      function: null, // Highlight plans are not for a specific function
      planType: 'highlight-video',
      aiOutput,
    });

    res.status(201).json({
      success: true,
      message: 'Highlight video plan generated successfully',
      data: videoPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate highlight video plan',
    });
  }
};

// POST /api/ai/album-design
// Generates album design suggestions
const generateAlbumDesign = async (req, res) => {
  try {
    const { weddingId } = req.body;

    if (!weddingId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide weddingId',
      });
    }

    if (!weddingId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wedding ID format',
      });
    }

    // Fetch wedding with functions
    const wedding = await Wedding.findById(weddingId).populate('functions');
    if (!wedding) {
      return res.status(404).json({
        success: false,
        message: 'Wedding not found',
      });
    }

    // Build prompt for album design
    const prompt = buildAlbumDesignPrompt(wedding, wedding.functions);

    // Get AI response
    const aiOutput = await generateAIResponse(prompt);

    // Save the album design
    const albumDesign = await AlbumDesign.create({
      wedding: weddingId,
      theme: aiOutput.albumTheme || wedding.weddingTheme,
      aiOutput,
    });

    res.status(201).json({
      success: true,
      message: 'Album design generated successfully',
      data: albumDesign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate album design',
    });
  }
};

module.exports = {
  generateFunctionVideoPlan,
  generateHighlightVideoPlan,
  generateAlbumDesign,
};
