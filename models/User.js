const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: String,
  password: String,
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

module.exports = mongoose.model('User', userSchema);
