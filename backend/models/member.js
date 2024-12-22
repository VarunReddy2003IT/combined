const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  collegeId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  team: { type: String, required: true }, // Team or department the member belongs to
  assignedTasks: { type: [String], default: [] }, // Tasks assigned to the member
  createdAt: { type: Date, default: Date.now }, // Timestamp for account creation
});

module.exports = mongoose.model('Member', memberSchema,'Member');
