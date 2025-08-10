// src/components/SignupForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [farmName, setFarmName] = useState("");
  const [location, setLocation] = useState("");
  const [farmType, setFarmType] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://agricogassist-backend.onrender.com/api/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, farmName, location, farmType }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.name, data.farmName);
        navigate("/dashboard");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Server error");
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {error && <div className="error">{error}</div>}
      <input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
      <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <input placeholder="Farm Name" value={farmName} onChange={e => setFarmName(e.target.value)} required />
      <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required />
      <input placeholder="Farm Type" value={farmType} onChange={e => setFarmType(e.target.value)} required />
      <button type="submit">Sign Up</button>
    </form>
  );
}


