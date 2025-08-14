// server/index.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRouter = require("./auth");
const usersRouter = require("./users");
const weatherRouter = require("./weather");
const perplexityRouter = require("./perplexity");

const app = express();

app.use(cors({
  origin: [
    "https://www.agricogassist.com",
    "https://agricog-assist.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:5173",
  ],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true,
}));
app.options("*", cors());

app.use(express.json());

app.use("/api", authRouter);
app.use("/api", usersRouter);
app.use("/api", weatherRouter);
app.use("/api", perplexityRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});








