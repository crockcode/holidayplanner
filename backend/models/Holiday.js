const mongoose = require('mongoose');

// Define the holiday schema
const holidaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Trim whitespace
    },
    destination: {
      type: String,
      required: true,
      trim: true, // Trim whitespace
    },
    startDate: {
      type: Date,
      required: true, // Holiday start date
    },
    endDate: {
      type: Date,
      required: true, // Holiday end date
    },
    description: {
      type: String,
      required: true,
      trim: true, // Trim whitespace
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    subscribers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
    }],
    expectedWeather: {
      type: String,
      trim: true,
    },
    budgetLimit: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Prototype Pattern: Clone method
holidaySchema.methods.clone = async function() {
  const clonedHoliday = new Holiday({
    name: `Copy of ${this.name}`,
    destination: this.destination,
    startDate: this.startDate,
    endDate: this.endDate,
    description: this.description,
    userId: this.userId,
    // Don't clone subscribers
    subscribers: [],
    expectedWeather: this.expectedWeather,
    budgetLimit: this.budgetLimit
  });
  
  return clonedHoliday;
};

// Observer Pattern: Notify subscribers
holidaySchema.methods.notifySubscribers = async function() {
  console.log(`Notifying ${this.subscribers.length} subscribers about update to holiday: ${this.name}`);
  // In a real implementation, you might send emails, push notifications, etc.
  return this.subscribers;
};

// Create the Holiday model based on the schema
const Holiday = mongoose.model('Holiday', holidaySchema);

module.exports = Holiday;
