// server/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// In-memory users store (for demonstration)
const USERS = [];

// Helper to log and respond on error
function handleError(res, where, error) {
  console.error(`[Login Error][${where}]:`, error);
  return res.status(500).json({ message: `Server error at ${where}` });
}

// Login route with detailed logging
router.post("/login", async (req, res) => {
  console.log("[Login] Request body:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    console.warn("[Login] Missing email or password");
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find user
    const user = USERS.find((u) => u.email === email);
    if (!user) {
      console.warn("[Login] User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.warn("[Login] Password mismatch for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log("[Login] Password verified for:", email);

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error("[Login] Missing JWT_SECRET env var");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Issue token
    const token = jwt.sign(
      { email: user.email, name: user.name, farmName: user.farmName },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("[Login] JWT created for:", email);

    return res.status(200).json({ token, name: user.name, farmName: user.farmName });
  } catch (error) {
    return handleError(res, "login", error);
  }
});

module.exports = router;





