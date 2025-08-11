// server/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// In-memory users store (for demonstration)
const USERS = [];

// Signup route with detailed logging
router.post("/signup", async (req, res) => {
  console.log("[Signup] Request body:", req.body);
  const requiredFields = ["name", "email", "password", "farmName", "location", "farmType"];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      console.error(`[Signup] Missing field: ${field}`);
      return res.status(400).json({ message: `Missing ${field}` });
    }
  }

  try {
    const { name, email, password, farmName, location, farmType } = req.body;
    const existing = USERS.find(u => u.email === email);
    if (existing) {
      console.warn("[Signup] Duplicate email:", email);
      return res.status(400).json({ message: "Email exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    USERS.push({ name, email, passwordHash, farmName, location, farmType });
    console.log("[Signup] User saved:", email);

    if (!process.env.JWT_SECRET) {
      console.error("[Signup] Missing JWT_SECRET env var");
      return res.status(500).json({ message: "Server configuration error" });
    }
    const token = jwt.sign({ email, name, farmName }, process.env.JWT_SECRET);
    console.log("[Signup] JWT created");

    return res.status(201).json({ token, name, farmName });
  } catch (err) {
    console.error("[Signup] Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Login route with detailed logging
router.post("/login", async (req, res) => {
  console.log("[Login] Request body:", req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    console.warn("[Login] Missing email or password");
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = USERS.find(u => u.email === email);
    if (!user) {
      console.warn("[Login] User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.warn("[Login] Password mismatch for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log("[Login] Password verified for:", email);

    if (!process.env.JWT_SECRET) {
      console.error("[Login] Missing JWT_SECRET env var");
      return res.status(500).json({ message: "Server configuration error" });
    }
    const token = jwt.sign(
      { email: user.email, name: user.name, farmName: user.farmName },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("[Login] JWT created for:", email);

    return res.status(200).json({ token, name: user.name, farmName: user.farmName });
  } catch (error) {
    console.error("[Login] Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;






