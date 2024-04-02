const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  mobile: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
