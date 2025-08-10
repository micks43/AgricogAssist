// server/perplexity.js
const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

router.post("/perplexity", async (req, res) => {
  try {
    const { question, messages } = req.body;

    // Build messages for Perplexity: prefer provided messages, else wrap the question
    const convo = Array.isArray(messages) && messages.length
      ? messages
      : [{ role: "user", content: question }];

    const apiRes = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: convo,
      }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({
        message: data.error?.message || "Perplexity API error",
      });
    }

    const msg = data.choices?.[0]?.message;
    if (msg?.content) {
      return res.json({ answer: msg.content });
    } else {
      return res.status(400).json({ message: "Unexpected response from Perplexity" });
    }
  } catch (err) {
    console.error("Perplexity error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;






