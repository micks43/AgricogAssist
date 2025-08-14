// src/components/PerplexityChat.jsx

import React, { useState } from "react";

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
          body: JSON.stringify({ question: userInput }),

        }
      );
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to fetch response");
      } else {
        const data = await res.json();
        setAnswer(data.answer);
      }
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }

  const containerStyle = {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "20px",
    marginTop: "24px",
    maxWidth: "600px",
    fontFamily: "Arial, sans-serif",
  };

  const titleStyle = {
    marginBottom: "16px",
    fontSize: "20px",
    color: "#2d3748",
  };

  const formStyle = {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
  };

  const textareaStyle = {
    flex: 1,
    padding: "12px",
    border: "1px solid #cbd5e0",
    borderRadius: "6px",
    fontSize: "16px",
    resize: "vertical",
    fontFamily: "inherit",
  };

  const buttonStyle = {
    padding: "12px 24px",
    backgroundColor: loading ? "#a0aec0" : "#48bb78",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: loading ? "not-allowed" : "pointer",
  };

  const errorStyle = {
    color: "#e53e3e",
    marginBottom: "16px",
  };

  const answerContainerStyle = {
    backgroundColor: "#edf2f7",
    borderLeft: "4px solid #48bb78",
    borderRadius: "4px",
    padding: "16px",
    color: "#2d3748",
    lineHeight: "1.6",
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Live Info Chat (Styled)</h3>
      <form style={formStyle} onSubmit={handleSubmit}>
        <textarea
          style={textareaStyle}
          placeholder="Ask a farming question…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          disabled={loading}
          required
        />
        <button style={buttonStyle} type="submit" disabled={loading}>
          {loading ? "Thinking…" : "Ask"}
        </button>
      </form>

      {error && <div style={errorStyle}>{error}</div>}

      {answer && (
        <div style={answerContainerStyle}>
          {answer
            .split("\n\n")
            .map((para, i) => (
              <p key={i} style={{ margin: "0 0 12px" }}>
                {para}
              </p>
            ))}
        </div>
      )}
    </div>
  );
}






