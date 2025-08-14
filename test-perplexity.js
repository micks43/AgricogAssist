// server/test-perplexity.js

require("dotenv").config();
const fetch = require("node-fetch");

async function test() {
  console.log("Using key:", process.env.PERPLEXITY_API_KEY?.slice(0, 8) + "…");

  try {
    const res = await fetch("https://api.perplexity.ai/v1/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.PERPLEXITY_API_KEY,
      },
      body: JSON.stringify({ query: "Test API access" }),
    });

    console.log("Status:", res.status);

    const body = await res.text();
    console.log("Body:", body);
  } catch (err) {
    console.error("Error during fetch:", err);
  }
}

test();

