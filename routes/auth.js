require('dotenv').config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");

const JWT_SECRET = process.env.JWT_SECRET || "Yuktipayak@1804";
// At the top of your main server file (e.g., index.js or app.js)


if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
  process.exit(1); // Exit the process with an error code
}

// Register
// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email already exists" });

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ msg: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ msg: "User registered successfully", token });

  } catch (err) {
    console.error("Registration error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Duplicate entry. Username or email already taken." });
    }
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ msg: "Invalid email" });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

//   const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

//   res.json({ token });
// });
router.post("/login", async (req, res) => {
  console.log("Login attempt:", req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;