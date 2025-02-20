const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

const SECRET = process.env.SECRET; ;  // This should be in an environment variable in a real application



// Define the User schema with validation improvements
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Ensures that the email is unique
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address'], // Validates email format
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the creation date to the current date and time
  },
});


// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;


// Define the Customer schema
const customerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address']
  },
  first_name: {
    type: String,
    required: true,
    maxlength: [100, 'First name must be less than or equal to 100 characters']
  },
  last_name: {
    type: String,
    required: true,
    maxlength: [100, 'Last name must be less than or equal to 100 characters']
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please provide a valid phone number']  // Ensure 10-digit phone number
  },
  address: {
    type: String,
    required: true,
  },
  pan: {
    type: String,
    required: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please provide a valid PAN number'],  // PAN card format
  },
  aadhar_no: {
    type: String,
    required: true,
    match: [/^\d{12}$/, 'Please provide a valid Aadhar number']  // Aadhar number format (12 digits)
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Update the `updated_at` timestamp whenever a document is updated
customerSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Create and export the Customer model
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;



const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const mongoURI = process.env.MONGODB_URI; // Get the URI from .env

if (!mongoURI) {
  console.error("MONGODB_URI environment variable is not set.");
  process.exit(1); // Exit the application if the URI is missing
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB-New'))
.catch(err => console.error('Error connecting to MongoDB:', err.message));


// User routes
app.post('/signup', async (req, res) => {
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

app.post('/login', async (req, res) => {
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});


app.post('/onboarding', authenticateJwt, async (req, res) => {
  const { first_name, last_name, date_of_birth, phone_number, address, pan, aadhar_no } = req.body;

  try {
    // Extract email from the JWT token
    const username = req.user.username;

    // Check if customer already exists with the same email
    const existingCustomer = await Customer.findOne({ username });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer profile already exists with this email' });
    }
    
    // Create a new customer
    const newCustomer = new Customer({
      username,
      first_name,
      last_name,
      date_of_birth,
      phone_number,
      address,
      pan,
      aadhar_no,
    });

    await newCustomer.save();
    res.status(201).json({ message: 'Customer profile created successfully', customer: newCustomer });
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer profile', error: error.message });
  }
});



app.listen(3000, () => console.log('Server running on port 3000'));