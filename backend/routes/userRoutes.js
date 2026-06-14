const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      phone,
      email,
      password: hashedPassword
    });

    // Save user
    await user.save();

    res.status(201).json({
      message: "Registration successful"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "User not found"
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        message: "Wrong password"
      });
    }

    res.json({
  message: "Login successful",
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone
  }
});

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
module.exports = router;