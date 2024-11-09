const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserType = require('./enum/userType');

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserType), required: true },
  isVerified: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
