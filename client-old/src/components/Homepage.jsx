import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function Homepage() {
  return (
    <div className="home-container">
      <h1>🌾 FarmWeather</h1>
      <p>Accurate 7-day forecasts for every UK postcode.</p>
      <div className="button-group">
        <Link to="/signup" className="btn btn-primary">Sign Up</Link>
        <Link to="/login" className="btn btn-outline">Log In</Link>
      </div>
    </div>
  );
}
