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
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          farmName, 
          location, 
          farmType 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.name, data.farmName);
        navigate("/dashboard");
      } else {
        setError(data.message || "Sign-up failed");
      }
    } catch (err) {
      setError("Server error");
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Create Your Farm Account</h2>
      {error && <div className="error">{error}</div>}
      
      <input 
        placeholder="Your Name" 
        value={name} 
        onChange={e => setName(e.target.value)} 
        required 
      />
      
      <input 
        placeholder="Email" 
        type="email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        required 
      />
      
      <input 
        placeholder="Password" 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        required 
      />
      
      <input 
        placeholder="Farm Name" 
        value={farmName} 
        onChange={e => setFarmName(e.target.value)} 
        required 
      />
      
      <input 
        placeholder="Location (Town/Village)" 
        value={location} 
        onChange={e => setLocation(e.target.value)} 
        required 
      />
      
      <select 
        value={farmType} 
        onChange={e => setFarmType(e.target.value)} 
        required
      >
        <option value="">Select Farm Type</option>
        <option value="Dairy">Dairy</option>
        <option value="Arable">Arable/Crops</option>
        <option value="Livestock">Livestock</option>
        <option value="Mixed">Mixed Farming</option>
        <option value="Organic">Organic</option>
      </select>
      
      <button type="submit">Create Farm Account</button>
    </form>
  );
}

