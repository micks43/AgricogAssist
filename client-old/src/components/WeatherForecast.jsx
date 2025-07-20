import React from "react";
import "../App.css";

export default function WeatherForecast({ forecast }) {
  return (
    <div className="forecast-container">
      <h3>7-Day Forecast</h3>
      <div className="forecast-scroll">
        {forecast.daily.map((day, i) => (
          <div key={i} className="forecast-card">
            <div>{new Date(day.dt * 1000).toLocaleDateString("en-GB", { weekday: "long" })}</div>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].description}
            />
            <div>{day.weather[0].description}</div>
            <div>Min: {Math.round(day.temp.min)}°C</div>
            <div>Max: {Math.round(day.temp.max)}°C</div>
          </div>
        ))}
      </div>
    </div>
  );
}
