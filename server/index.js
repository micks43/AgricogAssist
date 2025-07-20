require("dotenv").config();
const express = require("express");
const cors = require("cors");
const auth = require("./auth");
const users = require("./users");
const weather = require("./weather");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", auth);
app.use("/api", users);
app.use("/api", weather);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
