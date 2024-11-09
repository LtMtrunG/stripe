const UserService = require('../user/userService');
const { generateToken, setCookie } = require('../../utils'); 
const bcrypt = require('bcrypt');

// Login a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json("BAD_REQUEST: Please provide email and password");
    }

    const { id, role } = await UserService.login(email, password);

    const tokens = await generateToken(id, role);
    setCookie(res, tokens);

    return res.status(200).json("User authenticated successfully");
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  login,
};
