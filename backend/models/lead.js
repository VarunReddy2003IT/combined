const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  collegeId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  team: { type: String, required: true }, // Team or department the lead is managing
  projects: { type: [String], default: [] }, // List of projects assigned to the lead
  createdAt: { type: Date, default: Date.now }, // Timestamp for account creation
});

module.exports = mongoose.model('Lead', leadSchema,'Lead');
