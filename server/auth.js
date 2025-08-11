const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router = express.Router();

const USERS = [];

router.post("/signup", async (req, res) => {
  console.log("[Signup] Incoming body:", req.body);
  const required = ["name","email","password","farmName","location","farmType"];
  for (const field of required) {
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

    const hash = await bcrypt.hash(password, 10);
    const user = { name, email, passwordHash: hash, farmName, location, farmType };
    USERS.push(user);
    console.log("[Signup] User saved:", email);

    // JWT_SECRET must be set
    if (!process.env.JWT_SECRET) {
      console.error("[Signup] Missing JWT_SECRET env var");
      return res.status(500).json({ message: "Server configuration error" });
    }
    const token = jwt.sign({ email, name, farmName }, process.env.JWT_SECRET);
    console.log("[Signup] JWT created");

    // Attempt to send email (optional)
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Welcome to Agricog Assist",
        html: `<p>Hello ${name}, welcome!</p>`,
      });
      console.log("[Signup] Welcome email sent");
    } else {
      console.warn("[Signup] Email env vars not fully set; skipping email");
    }

    return res.status(201).json({ token, name, farmName });
  } catch (err) {
    console.error("[Signup] Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;




