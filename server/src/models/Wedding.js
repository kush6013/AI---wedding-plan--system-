// Wedding model - stores wedding details and links to functions
// Each wedding belongs to a client and can have multiple functions

const mongoose = require('mongoose');

const weddingSchema = new mongoose.Schema(
  {
    // Client information
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },

    // Wedding information
    coupleName: {
      type: String,
      required: [true, 'Couple name is required'],
      trim: true,
    },
    weddingDate: {
      type: Date,
      required: [true, 'Wedding date is required'],
    },
    weddingLocation: {
      type: String,
      required: [true, 'Wedding location is required'],
      trim: true,
    },
    weddingCity: {
      type: String,
      trim: true,
      default: '',
    },
    weddingDescription: {
      type: String,
      trim: true,
      default: '',
    },
    weddingTheme: {
      type: String,
      trim: true,
      default: 'Traditional Indian',
    },
    guestCount: {
      type: Number,
      default: 0,
    },

    // References to functions belonging to this wedding
    // Each function (Haldi, Mehendi, etc.) is stored separately
    // and linked here by ObjectId
    functions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Function',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Wedding', weddingSchema);
