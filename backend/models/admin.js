const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  collegeId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permissions: { type: [String], default: ['manage-users', 'view-reports', 'configure-system'] }, // Array of permissions
  createdAt: { type: Date, default: Date.now }, // Timestamp for account creation
});

module.exports = mongoose.model('Admin', adminSchema,'Admin');
