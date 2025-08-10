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

  return (
    <div className="perplexity-chat-container">
      <h3 className="chat-title">Live Info Chat</h3>
      <form className="chat-form" onSubmit={handleSubmit}>
        <textarea
          className="chat-input"
          placeholder="Ask a farming question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          disabled={loading}
          required
        />
        <button className="chat-button" type="submit" disabled={loading}>
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {error && <div className="chat-error">{error}</div>}

      {answer && (
        <div className="chat-answer">
          {answer
            .split("\n\n")
            .map((para, i) => (
              <p key={i} className="answer-paragraph">
                {para}
              </p>
            ))}
        </div>
      )}
    </div>
  );
}




