// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const auth = require("./auth");
const users = require("./users");
const weather = require("./weather");
const perplexity = require("./perplexity");

const app = express();

// CORS configuration - MUST come before other middleware
const corsOptions = {
  origin: [
    'https://www.agricogassist.com',
    'https://agricog-assist.vercel.app', 
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Body parsing
app.use(express.json());

// API routes
app.use("/api", auth);
app.use("/api", users);
app.use("/api", weather);
app.use("/api", perplexity);

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});



