const mongoose = require('mongoose');
const Counter = require('./customer.js')

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// Customer Schema
const customerSchema2 = new mongoose.Schema({
 customer_id: {
        type: Number,
        unique: true, // Ensure customer_id is unique
        },
  username: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address'],
  },
  first_name: {
    type: String,
    required: true,
    maxlength: [100, 'First name must be less than or equal to 100 characters'],
  },
  last_name: {
    type: String,
    required: true,
    maxlength: [100, 'Last name must be less than or equal to 100 characters'],
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please provide a valid phone number'],
  },
  address: {
    type: String,
    required: true,
  },
  pan: {
    type: String,
    required: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please provide a valid PAN number'],
  },
  aadhar_no: {
    type: String,
    required: true,
    match: [/^\d{12}$/, 'Please provide a valid Aadhar number'],
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


customerSchema2.pre('save', async function (next) {
  if (!this.customer_id) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { key: 'customer_id' },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      this.customer_id = counter.value;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Customer = mongoose.model('Customer', customerSchema2)
  

const User = mongoose.model('User', userSchema);

module.exports = { User, Customer };
