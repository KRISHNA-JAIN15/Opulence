const User = require("../models/user");
const { generateToken } = require("../utils/token");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

module.exports = { signup, login, logout };