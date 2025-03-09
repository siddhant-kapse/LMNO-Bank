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
  },
  phone_number: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pan: {
    type: String,
    required: true,
  },
  aadhar_no: {
    type: String,
    required: true,
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

// Account Schema
const accountSchema = new mongoose.Schema({
    customer_id: {
      type: Number,
      required: true,
      ref: 'Customer',
    },
    account_number: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 10000.0,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  });
  
  accountSchema.pre('save', async function (next) {
    if (!this.account_number) {
      let isUnique = false;
      while (!isUnique) {
        // Generate a 10-digit random number
        const accountNumber = Math.floor(1000000000 + Math.random() * 900000).toString();
  
        // Check if the account number already exists
        const existingAccount = await Account.findOne({ account_number: accountNumber });
  
        // If the account number doesn't exist, use it
        if (!existingAccount) {
          this.account_number = accountNumber;
          isUnique = true;
        }
      }
    }
    next();
  });

  // Transaction Schema
  const transactionSchema = new mongoose.Schema({
    customer_id: {
      type: Number,
      required: true,
      ref: 'Customer',
    },
    transaction_type: {
      type: String,
      enum: ['Deposit', 'Withdrawal', 'Transfer'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transaction_date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      maxlength: 255,
    },
  });
  

	
const User = mongoose.model('User', userSchema);
const Customer = mongoose.model('Customer', customerSchema2);
const Account = mongoose.model('Account', accountSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = { User, Customer, Account, Transaction };