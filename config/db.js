const mongoose = require('mongoose');

const connectDB = () => {
  mongoose.connect('mongodb+srv://siddhantsimple2:MBnQDcyBveJg1DwS@cluster0.zcfoo.mongodb.net/LMNO2')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err.message));
};

module.exports = connectDB;
