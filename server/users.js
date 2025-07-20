// For extension: handle account deletion, etc.
const express = require("express");
const router = express.Router();

router.delete("/users/me", (req, res) => {
  // Not implemented in MVP
  res.json({ message: "Account deletion not implemented in MVP." });
});

module.exports = router;
