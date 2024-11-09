require("dotenv").config();
const UserRepository = require('./userRepository');
const bcrypt = require('bcrypt');
const { validateRegisterRequest } = require('./userDto');

class UserService {

  async login(email, password, res) {
    // Find the user by email
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not Found');
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }

    return {
      id: user.id,
      role: user.role
    };
  }

  async getUserById(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUserByEmail(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new UserService();