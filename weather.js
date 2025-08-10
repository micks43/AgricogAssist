const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

// Helper to get coordinates from postcode/town
async function getLatLon(location) {
  const geoRes = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${process.env.OWM_KEY}`
  );
  const geo = await geoRes.json();
  if (!geo[0]) throw new Error("Location not found");
  return { lat: geo[0].lat, lon: geo[0].lon };
}

router.get("/weather", async (req, res) => {
  try {
    const { location } = req.query;
    if (!location)
      return res.status(400).json({ message: "Location required" });

    // 1. Lookup coordinates for the location (postcode/town)
    const geoRes = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${process.env.OWM_KEY}`
    );
    const geo = await geoRes.json();
    console.log("Geocoding returned:", geo); // For debugging

    if (!geo[0]) return res.status(404).json({ message: "Location not found" });

    const { lat, lon } = geo[0];

    // 2. Get weather for the found coordinates
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OWM_KEY}`
    );
    const weather = await weatherRes.json();

    if (weatherRes.ok && weather.list) {
      // Send all forecast entries (~40, covering 5 days at 3-hour intervals)
      console.log("Number of forecast entries being sent:", weather.list.length);
      console.log("Dates:", weather.list.map(e => e.dt_txt));
    res.json({ daily: weather.list });
    } else {
      res.status(400).json({ message: "Weather unavailable" });
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;




module.exports = router;
