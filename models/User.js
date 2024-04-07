const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  // username: { type: String, unique: true },
  phone: { type: Number, required: true, unique: true },
  // name: { type: String },
  // age: { type: Number },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
