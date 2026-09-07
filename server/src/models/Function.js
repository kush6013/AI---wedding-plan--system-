// Function model - stores individual wedding functions
// Examples: Haldi, Mehendi, Sangeet, Wedding ceremony, Reception
// Each function belongs to one wedding

const mongoose = require('mongoose');

const functionSchema = new mongoose.Schema(
  {
    // Link to the parent wedding
    wedding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: [true, 'Wedding reference is required'],
    },
    functionName: {
      type: String,
      required: [true, 'Function name is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Function date is required'],
    },
    startTime: {
      type: String,
      trim: true,
      default: '',
    },
    endTime: {
      type: String,
      trim: true,
      default: '',
    },
    venue: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    importance: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Function', functionSchema);
