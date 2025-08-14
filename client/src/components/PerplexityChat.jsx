import React, { useState } from "react";
import "./PerplexityChat.css"; // add styles as needed

export default function PerplexityChat() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || "https://api.agricogassist.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setChatHistory((prev) => [...prev, { role: "user", content: userInput }]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/perplexity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userInput }),
      });
      if (!res.ok) throw new Error(res.statusText);
      const { answer } = await res.json();

      setChatHistory((prev) => [...prev, { role: "ai", content: answer }]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", content: "Error retrieving answer. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
      setUserInput("");
    }
  };

  return (
    <div className="perplexity-chat-container">
      <div className="chat-window">
        {chatHistory.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}-bubble`}>
            <strong>{m.role === "user" ? "You:" : "AI:"}</strong> {m.content}
          </div>
        ))}
        {isLoading && <div className="chat-bubble ai-bubble">AI is typing…</div>}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask a farming question..."
          rows={2}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !userInput.trim()}>
          {isLoading ? "…" : "Ask"}
        </button>
      </form>
    </div>
  );
}






