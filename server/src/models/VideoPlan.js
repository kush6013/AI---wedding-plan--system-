// VideoPlan model - stores AI-generated video plans
// Can be either a function-specific plan or an overall highlight plan

const mongoose = require('mongoose');

const videoPlanSchema = new mongoose.Schema(
  {
    // Link to the wedding this plan belongs to
    wedding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: [true, 'Wedding reference is required'],
    },
    // Optional: link to specific function (null for highlight plans)
    function: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Function',
      default: null,
    },
    // Plan type: 'function-video' or 'highlight-video'
    planType: {
      type: String,
      enum: ['function-video', 'highlight-video'],
      required: [true, 'Plan type is required'],
    },
    // Stores the complete AI-generated output as a JSON object
    // This is flexible so different plan types can have different structures
    aiOutput: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'AI output is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('VideoPlan', videoPlanSchema);
