const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  phone: { type: Number, required: true, unique: true },
  location: { type: Object },
  lastSeenAt: { type: Number },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
