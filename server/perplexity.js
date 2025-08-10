const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

router.post("/perplexity-chat", async (req, res) => {
  console.log("== Received request to /perplexity-chat ==");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const apiRes = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sonar-pro", // This line is now correct!
        messages: req.body.messages,
      }),
    });

    const data = await apiRes.json();
    console.log("== Perplexity API responded ==");
    console.log(JSON.stringify(data, null, 2));

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return res.json(data.choices[0].message);
    } else {
      console.warn("Unexpected response format from Perplexity API");
      return res.status(400).json({ content: "No response from Perplexity API" });
    }
  } catch (error) {
    console.error("Error calling Perplexity API:", error);
    return res.status(500).json({ content: "Error connecting to Perplexity" });
  }
});

module.exports = router;





