const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const USERS = []; // [{name, email, passwordHash}]

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (USERS.find(u => u.email === email))
    return res.status(400).json({ message: "Email already exists" });
  const passwordHash = await bcrypt.hash(password, 10);
  USERS.push({ name, email, passwordHash });
  const token = jwt.sign({ name, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, name });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ name: user.name, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, name: user.name });
});

module.exports = router;
