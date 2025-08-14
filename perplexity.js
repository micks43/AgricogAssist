// server/perplexity.js

// 1. Confirm dotenv is loaded and key is present
console.log(
  "Loaded PERPLEXITY_API_KEY:",
  process.env.PERPLEXITY_API_KEY
    ? process.env.PERPLEXITY_API_KEY.slice(0, 8) + "…"
    : "❌ MISSING"
);

const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.post("/perplexity", async (req, res) => {
  const { query } = req.body;
  console.log("Perplexity route hit with query:", query);

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: "sonar",               // ← use a supported model name
        messages: [
          { role: "system", content: "You are a helpful agricultural assistant." },
          { role: "user", content: query }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    console.log("Perplexity API status:", response.status);

    const text = await response.text();
    if (!response.ok) {
      console.error("Perplexity API error:", text);
      return res
        .status(502)
        .json({ error: "Perplexity API error", details: text });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      console.error("Error parsing Perplexity API JSON:", parseErr, "Raw:", text);
      return res
        .status(502)
        .json({ error: "Invalid JSON from Perplexity", details: text });
    }

    console.log("Perplexity API data:", data);

    const answer = data.choices?.[0]?.message?.content;
    if (!answer) {
      console.error("No answer field in Perplexity response:", data);
      return res
        .status(502)
        .json({ error: "No answer field", details: JSON.stringify(data) });
    }

    return res.json({ answer });
  } catch (err) {
    console.error("Server error on Perplexity route:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;



















