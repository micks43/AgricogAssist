import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import WeatherForecast from "./WeatherForecast";
import "../App.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useState("");
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");

  async function fetchForecast(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
      const data = await res.json();
      if (res.ok) setForecast(data);
      else setError(data.message || "Failed to fetch forecast");
    } catch {
      setError("Could not fetch weather");
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <span>Hello, {user}</span>
        <button className="btn-logout" onClick={logout}>Logout</button>
      </div>
      <form className="location-form" onSubmit={fetchForecast}>
        <input
          placeholder="Enter UK postcode or town"
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
        />
        <button type="submit">Show Forecast</button>
      </form>
      {error && <div className="error">{error}</div>}
      {forecast && <WeatherForecast forecast={forecast} />}
    </div>
  );
}
