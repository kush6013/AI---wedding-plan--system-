// AlbumDesign model - stores AI-generated album design suggestions
// Includes theme, color palette, page structure, and layout advice

const mongoose = require('mongoose');

const albumDesignSchema = new mongoose.Schema(
  {
    // Link to the wedding this album design belongs to
    wedding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: [true, 'Wedding reference is required'],
    },
    // Theme name for this album design
    theme: {
      type: String,
      trim: true,
      default: '',
    },
    // Complete AI-generated album design output stored as JSON
    aiOutput: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'AI output is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AlbumDesign', albumDesignSchema);
