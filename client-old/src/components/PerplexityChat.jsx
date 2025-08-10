import React, { useState } from "react";

export default function PerplexityChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    const updated = [...messages, newMessage];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/perplexity-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages([...updated, { role: "assistant", content: data.content }]);
    } catch {
      setMessages([
        ...updated,
        { role: "assistant", content: "Error: couldn’t reach Perplexity." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="perplexity-chat">
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            <strong>{m.role === "user" ? "You" : "AI"}:</strong> {m.content}
          </div>
        ))}
        {loading && <div className="message assistant">AI is thinking...</div>}
      </div>
      <form onSubmit={sendMessage} className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about live market prices, regulations, etc..."
          required
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
);
}
