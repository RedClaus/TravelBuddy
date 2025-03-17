const mongoose = require('mongoose');

const ItinerarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Itinerary title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  destination: {
    name: {
      type: String,
      required: [true, 'Destination name is required']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    country: String,
    city: String
  },
  activities: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    category: {
      type: String,
      enum: ['flight', 'hotel', 'restaurant', 'attraction', 'transportation', 'other'],
      default: 'other'
    },
    location: {
      name: String,
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    startDateTime: {
      type: Date,
      required: true
    },
    endDateTime: Date,
    confirmationNumber: String,
    attachments: [{
      name: String,
      fileUrl: String,
      fileType: String,
      uploadDate: {
        type: Date,
        default: Date.now
      }
    }],
    notes: String,
    cost: {
      amount: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    status: {
      type: String,
      enum: ['confirmed', 'pending', 'cancelled'],
      default: 'confirmed'
    },
    reminders: [{
      time: Date,
      message: String,
      sent: {
        type: Boolean,
        default: false
      }
    }]
  }],
  budget: {
    total: Number,
    spent: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    categories: [{
      name: String,
      amount: Number,
      spent: {
        type: Number,
        default: 0
      }
    }]
  },
  travelCompanions: [{
    name: String,
    email: String,
    phone: String,
    relationship: String
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for duration in days
ItinerarySchema.virtual('durationDays').get(function() {
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

// Method to calculate total cost of all activities
ItinerarySchema.methods.calculateTotalCost = function() {
  return this.activities.reduce((total, activity) => {
    return total + (activity.cost?.amount || 0);
  }, 0);
};

// Method to get upcoming activities
ItinerarySchema.methods.getUpcomingActivities = function() {
  const now = new Date();
  return this.activities
    .filter(activity => activity.startDateTime > now)
    .sort((a, b) => a.startDateTime - b.startDateTime);
};

// Add text index for search
ItinerarySchema.index({ 
  title: 'text', 
  description: 'text', 
  'destination.name': 'text',
  'destination.country': 'text',
  'destination.city': 'text',
  'activities.title': 'text',
  'activities.description': 'text'
});

module.exports = mongoose.model('Itinerary', ItinerarySchema);
