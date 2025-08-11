// server/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router = express.Router();

const USERS = []; // In-memory store for now

// Helper to log and respond
function handleError(res, where, error) {
  console.error(`[Signup Error][${where}]:`, error);
  return res.status(500).json({ message: `Server error at ${where}` });
}

router.post("/signup", async (req, res) => {
  console.log("[Signup] Request body:", req.body);
  const { name, email, password, farmName, location, farmType } = req.body;
  if (!name || !email || !password || !farmName || !location || !farmType) {
    console.warn("[Signup] Missing fields:", req.body);
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    if (USERS.find(u => u.email === email)) {
      console.warn("[Signup] Duplicate email:", email);
      return res.status(400).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      passwordHash,
      farmName,
      location,
      farmType,
      fastbotsId: null,
      createdAt: new Date(),
      status: "active"
    };
    USERS.push(newUser);

    console.log("[Signup] New user created:", { email, farmName });

    // Send welcome email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: '"Agricog Assist" <mick@agricogassist.com>',
      to: email,
      subject: "Welcome to Agricog Assist – Farm Account Created!",
      html: `<h2>Welcome ${name}!</h2><p>Your farm "${farmName}" is ready.</p>`,
    };
    await transporter.sendMail(mailOptions);
    console.log("[Signup] Welcome email sent to:", email);

    // Issue token
    const token = jwt.sign({ name, email, farmName }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return res.status(201).json({ token, name, farmName });
  } catch (error) {
    return handleError(res, "signup", error);
  }
});

module.exports = router;


