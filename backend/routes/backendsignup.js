const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const Lead = require('../models/lead');
const Member = require('../models/member');
const SignupRequest = require('../models/signuprequest');
const nodemailer = require('nodemailer');

const router = express.Router();

// Nodemailer setup for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'varunreddy2new@gmail.com',  // Your Gmail address
    pass: 'bmly geoo gwkg jasu',         // The App Password you generated for Google Account
  },
});

// Signup route for handling user registration requests
router.post('/', async (req, res) => {
  const { name, collegeId, email, password, role } = req.body;

  // Validation for required fields
  if (!name || !collegeId || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if a signup request with the same email already exists
  const existingRequest = await SignupRequest.findOne({ email });
  if (existingRequest) {
    return res.status(400).json({ message: 'A signup request with this email already exists. Please wait for approval.' });
  }

  // Handle case for admin or lead signup requests
  if (role === 'admin' || role === 'lead') {
    // Save signup request for admin or lead
    const newRequest = new SignupRequest({
      name,
      collegeId,
      email,
      role,
      password: hashedPassword,
    });

    try {
      // Save the request in the database
      await newRequest.save();

      // Notify all current admins about the new signup request
      const admins = await Admin.find({});  // Fetch all admin emails
      const adminEmails = admins.map(admin => admin.email);  // Get all admin emails

      // Prepare email options to send to admins for approval
      const mailOptions = {
        from: 'varunreddy2new@gmail.com',  // Sender's email
        to: adminEmails,               // List of admins to notify
        subject: `New ${role} Signup Request`,  // Subject line
        html: `        
          <p>${name} (${email}) has requested to sign up as a ${role}.</p>
          <p>Click below to respond:</p>
<a href="http://192.168.x.x:5000/api/signup/approve/${newRequest._id}">Approve</a>
          <a href="http://localhost:5000/api/signup/reject/${newRequest._id}">Reject</a>
        `,  // Email body with links to approve or reject the signup
      };

      // Send the email to all admins
      await transporter.sendMail(mailOptions);

      // Respond to the client indicating that the request was submitted successfully
      res.status(200).json({ message: `Signup request submitted for ${role}. Awaiting admin approval.` });
    } catch (err) {
      console.error('Error handling signup request:', err);
      res.status(500).json({ message: 'Error processing signup request', error: err });
    }

  // Handle case for member signup
  } else if (role === 'member') {
    // Create member account directly (no admin approval)
    const newUser = new Member({
      name,
      collegeId,
      email,
      password: hashedPassword,
    });

    try {
      // Save member to the database
      await newUser.save();
      res.status(201).json({ message: 'Member created successfully' });
    } catch (err) {
      console.error('Error storing member data:', err);
      res.status(500).json({ message: 'Error storing member data', error: err });
    }

  } else {
    // If the role is invalid, respond with an error message
    res.status(400).json({ message: 'Invalid role' });
  }
});

// Route to approve signup request (admin only)
router.get('/approve/:id', async (req, res) => {
  const requestId = req.params.id;
  
  try {
    // Find the signup request by ID
    const request = await SignupRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Signup request not found' });
    }

    // If the role is admin or lead, create the respective user
    if (request.role === 'admin' || request.role === 'lead') {
      const UserModel = request.role === 'admin' ? Admin : Lead;

      const newUser = new UserModel({
        name: request.name,
        collegeId: request.collegeId,
        email: request.email,
        password: request.password, // Consider hashing again if required
      });

      await newUser.save();

      // Delete the signup request after approval
      await SignupRequest.findByIdAndDelete(requestId);

      res.status(200).json({ message: `${request.role} approved successfully` });
    } else {
      res.status(400).json({ message: 'Invalid role for approval' });
    }

  } catch (err) {
    console.error('Error approving signup request:', err);
    res.status(500).json({ message: 'Error processing approval', error: err });
  }
});

// Route to reject signup request (admin only)
router.get('/reject/:id', async (req, res) => {
  const requestId = req.params.id;
  
  try {
    // Find the signup request by ID and delete it
    const request = await SignupRequest.findByIdAndDelete(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Signup request not found' });
    }

    res.status(200).json({ message: 'Signup request rejected successfully' });
  } catch (err) {
    console.error('Error rejecting signup request:', err);
    res.status(500).json({ message: 'Error processing rejection', error: err });
  }
});

module.exports = router;
