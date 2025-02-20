const express = require('express');
const { Customer } = require('../models');  // Import the Customer model
const authenticateJwt = require('../middleware/authMiddleware');  // Import JWT middleware
const router = express.Router();

router.post('/onboarding', authenticateJwt, async (req, res) => {
  const { first_name, last_name, date_of_birth, phone_number, address, pan, aadhar_no } = req.body;

  try {
    // Get the username from the JWT token
    const username = req.user.username;

    // Check if customer already exists with the same username
    const existingCustomer = await Customer.findOne({ username });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer profile already exists with this email' });
    }

    // Create a new customer
    const newCustomer = new Customer({
      username,  // Using the username from the JWT token
      first_name,
      last_name,
      date_of_birth,
      phone_number,
      address,
      pan,
      aadhar_no,
    });

    // Save the new customer, customer_id will be auto-generated
    await newCustomer.save();
    res.status(201).json({ message: 'Customer profile created successfully', customer: newCustomer });
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer profile', error: error.message });
  }
});

module.exports = router;
