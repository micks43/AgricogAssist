// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const auth = require("./auth");
const users = require("./users");
const weather = require("./weather");
const perplexity = require("./perplexity");

const app = express();

// Explicit CORS settings to allow preflight for POST
app.use(cors({
  origin: ["https://agricog-assist.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight explicitly
app.options("*", cors());

app.use(express.json());
app.use("/api", auth);
app.use("/api", users);
app.use("/api", weather);
app.use("/api", perplexity);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

