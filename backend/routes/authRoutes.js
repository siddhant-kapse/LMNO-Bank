const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const SECRET = process.env.SECRET;  // This should be in an environment variable
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'User created successfully', token });
  }
});

// router.post('/login', async (req, res) => {
//   const { username, password } = req.headers;
//   const user = await User.findOne({ username, password });
//   if (user) {
//     const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
//     res.json({ message: 'Logged in successfully', token });
//   } else {
//     res.status(403).json({ message: 'Invalid username or password' });
//   }
// });

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { username: user.username, role: 'user' }, // Payload (data to include in the token)
      SECRET, // Secret key
      { expiresIn: '1h' } // Token expiration time
    );
    console.log('Generated Token:', token)

    // Send response with the token
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
module.exports = router;