import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import WeatherForecast from "./WeatherForecast";
import PerplexityChat from "./PerplexityChat";
import "../App.css";

export default function Dashboard() {
  const { user, farmName, logout } = useAuth();
  const [location, setLocation] = useState("");
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");

  async function fetchForecast(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(
        `/api/weather?location=${encodeURIComponent(location)}`
      );
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
        <div>
          <span>Hello, {user}</span>
          <div className="farm-info">🚜 {farmName} Farm Dashboard</div>
        </div>
        <button className="btn-logout" onClick={logout}>
          Logout
        </button>
      </div>

      <form className="location-form" onSubmit={fetchForecast}>
        <input
          placeholder="Enter town or village"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <button type="submit">Show Forecast</button>
      </form>

      {error && <div className="error">{error}</div>}
      {forecast && <WeatherForecast forecast={forecast} />}

      {/* --- Start Chatbots Section --- */}
      <div className="dashboard-chats">
        <section className="chat-section">
          <h2>Live Info Chat (Perplexity)</h2>
          <PerplexityChat />
        </section>
        <section className="chat-section">
          <h2>Farm Memory Chat (FastBots)</h2>
          <iframe
            src="https://app.fastbots.ai/embed/cmcuvry22008boelv6guop4fa"
            style={{ width: "100%", height: "600px", border: "none", borderRadius: "12px" }}
            title="Farm Memory Chat"
          />
        </section>
      </div>
      {/* --- End Chatbots Section --- */}
    </div>
  );
}

