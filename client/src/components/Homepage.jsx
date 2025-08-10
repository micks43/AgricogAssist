// src/components/Homepage.jsx

import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function Homepage() {
  return (
    <div className="homepage-hero">
      <div className="hero-content">
        <h1>Welcome to Agricog Assist</h1>
        <p>Your AI-powered farming companion</p>
        <div className="hero-buttons">
          <Link to="/signup">
            <button className="btn-primary">Sign Up</button>
          </Link>
          <Link to="/login">
            <button className="btn-secondary">Log In</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

