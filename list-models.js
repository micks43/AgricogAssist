// server/list-models.js

require("dotenv").config();
const fetch = require("node-fetch");

async function listModels() {
  try {
    const res = await fetch("https://api.perplexity.ai/chat/models", {
      headers: {
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
    });
    console.log("Status:", res.status);
    const body = await res.text();
    console.log("Models:", body);
  } catch (err) {
    console.error("Error fetching models:", err);
  }
}

listModels();


