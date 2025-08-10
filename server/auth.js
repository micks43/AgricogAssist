const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router = express.Router();

// Updated USERS array to store farm info
const USERS = []; // {name, email, passwordHash, farmName, location, farmType, fastbotsId, createdAt, status}

router.post("/signup", async (req, res) => {
  const { name, email, password, farmName, location, farmType } = req.body;
  
  if (USERS.find(u => u.email === email)) {
    return res.status(400).json({ message: "Email already exists" });
  }
  
  const passwordHash = await bcrypt.hash(password, 10);
  
  // Create new user with farm info
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
  
  // Create email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send enhanced welcome email
  const mailOptions = {
    from: '"Agricog Assist" <mick@agricogassist.com>',
    to: email,
    subject: "Welcome to Agricog Assist – Farm Account Created!",
    html: `
      <h2>Welcome to Agricog Assist!</h2>
      <p>Hello ${name},</p>
      <p>Your farm account for <strong>${farmName}</strong> has been successfully created.</p>
      
      <h3>Account Details:</h3>
      <ul>
        <li><strong>Farm Name:</strong> ${farmName}</li>
        <li><strong>Location:</strong> ${location}</li>
        <li><strong>Farm Type:</strong> ${farmType}</li>
        <li><strong>Login Email:</strong> ${email}</li>
      </ul>
      
      <p>Your personalized farm dashboard is ready!</p>
      <p><a href="https://agricogassist.com">Login to your dashboard</a></p>
      
      <p>Thank you for joining us!</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Failed to send welcome email:", error);
    } else {
      console.log("Welcome email sent:", info.response);
    }
  });

  // Include farmName in JWT token
  const token = jwt.sign({ name, email, farmName }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, name, farmName });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });
  
  // Include farmName in login response
  const token = jwt.sign({ name: user.name, email, farmName: user.farmName }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, name: user.name, farmName: user.farmName });
});

module.exports = router;

