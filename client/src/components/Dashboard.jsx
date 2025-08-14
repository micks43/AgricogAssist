import React, { useState } from "react";
import WeatherForecast from "./WeatherForecast";
import PerplexityChat from "./PerplexityChat";
import FastBotsChat from "./FastBotsChat"; // your existing memory chat

export default function Dashboard({ user, onLogout }) {
  const [location, setLocation] = useState("");

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Hello {user.name}, Welcome to your</h1>
        <h2>🚜 Help Dashboard</h2>
        <button className="btn-logout" onClick={onLogout}>Logout</button>
      </header>

      <section className="weather-section">
        <WeatherForecast />
      </section>

      <section className="perplexity-section">
        <h3>🌱 Latest Agri Info Chat</h3>
        <PerplexityChat />
      </section>

      <section className="fastbots-section">
        <h3>🤖 Farm Memory Chat (FastBots)</h3>
        <FastBotsChat />
      </section>
    </div>
);
}



