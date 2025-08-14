// server/auth.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router = express.Router();

const USERS = [];

// Configure Nodemailer transporter for Bluehost SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test email configuration when server starts
(async () => {
  try {
    await transporter.verify();
    console.log("✅ Email configuration is working!");
  } catch (error) {
    console.error("❌ Email configuration error:", error.message);
  }
})();

router.post("/signup", async (req, res) => {
  const { name, email, password, farmName, location, farmType } = req.body;
  if (!name || !email || !password || !farmName || !location || !farmType) {
    return res.status(400).json({ message: "Missing fields" });
  }
  if (USERS.find(u => u.email === email)) {
    return res.status(400).json({ message: "Email exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  USERS.push({ name, email, passwordHash, farmName, location, farmType });

  const token = jwt.sign(
    { email, name, farmName },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const mailOptions = {
    from: `"AgriCog Assist" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to AgriCog Assist!",
    html: `
      <p>Hi ${name},</p>
      <p>Welcome to AgriCog Assist. We're excited to help you optimize ${farmName}'s operations!</p>
      <p>Get started by logging in <a href="${process.env.APP_URL}/login">here</a>.</p>
      <p>Happy farming,<br/>The AgriCog Team</p>
    `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("❌ Error sending welcome email:", err.message);
    } else {
      console.log("✅ Welcome email sent successfully to:", email);
    }
  });

  res.status(201).json({ token, name, farmName });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = USERS.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { email: user.email, name: user.name, farmName: user.farmName },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, name: user.name, farmName: user.farmName });
});

module.exports = router;










