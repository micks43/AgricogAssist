// src/components/PerplexityChat.jsx

import React, { useState } from "react";
import "../App.css";

export default function PerplexityChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setAnswer("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://agricogassist-backend.onrender.com/api/perplexity",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setAnswer(data.answer);
      } else {
        setError(data.message || "Failed to fetch response");
      }
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="perplexity-chat">
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Ask a farming question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      {answer && <div className="answer">{answer}</div>}
    </div>
  );
}


