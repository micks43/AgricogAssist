import React, { useState } from "react";
import "./WeatherForecast.css";

export default function WeatherForecast() {
  const [city, setCity] = useState("");
  const [forecast, setForecast] = useState([]);

  const fetchForecast = async () => {
    const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const data = await res.json();
    setForecast(data.daily || []);
  };

  return (
    <div className="weather-forecast-container">
      <h3>☀️ Weather Forecast</h3>
      <div className="weather-form">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter town or village"
        />
        <button onClick={fetchForecast}>Get Forecast</button>
      </div>
      {forecast.length > 0 && (
        <div className="forecast-cards">
          {forecast.map((day) => (
            <div key={day.dt} className="forecast-card">
              <div>{new Date(day.dt * 1000).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</div>
              <div>{Math.round(day.temp.max)}° / {Math.round(day.temp.min)}°</div>
              <div>{day.weather[0].description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



