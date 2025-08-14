// server/perplexity.js

const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

router.post("/perplexity", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Missing query in request body" });
  }

  try {
    const apiRes = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sonar-medium",
        messages: [{ role: "user", content: query }],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return res
        .status(apiRes.status)
        .json({ error: "Perplexity API error", details: data });
    }

    const answer = data.choices?.[0]?.message?.content;
    if (!answer) {
      return res
        .status(502)
        .json({ error: "Invalid response from Perplexity API", details: data });
    }

    res.json({ answer });
  } catch (err) {
    console.error("Perplexity proxy error:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

module.exports = router;




















