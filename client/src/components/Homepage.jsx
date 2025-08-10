// client/src/components/Homepage.jsx

import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function Homepage() {
  return (
    <>
      {/* Logo Header */}
      <div className="header-logo">
        <img src="/logo.png" alt="Agricog Assist Logo" />
      </div>

      {/* Centered Page Content */}
      <div className="page-container">
        <div className="homepage-hero">
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
    </>
  );
}



