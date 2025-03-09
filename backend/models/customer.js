const mongoose = require('mongoose');

const counterSchema2 = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Number, required: true, default: 100 }, // Start from 101
});

const Counter = mongoose.model('Counter', counterSchema2);

module.exports = Counter;