require("dotenv").config();
const express = require("express");
const cors = require("cors");
const auth = require("./auth");
const users = require("./users");
const weather = require("./weather");
const perplexity = require("./perplexity");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", auth);
app.use("/api", users);
app.use("/api", weather);
app.use("/api", perplexity);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

