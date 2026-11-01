"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, clearError } = useChat();
  const busy = status === "submitted" || status === "streaming";
  const conversation = useRef<HTMLElement>(null);

  useEffect(() => {
    conversation.current?.scrollTo({ top: conversation.current.scrollHeight });
  }, [messages, status]);

  return (
    <main className="chat">
      <header>
        <p className="eyebrow">LABA · MÓJ AGENT</p>
        <h1>Mój chatbot</h1>
        <p className="subtitle">Twoje miejsce na rozmowę.</p>
      </header>
      <section ref={conversation} className="conversation" role="log" aria-label="Rozmowa" aria-live="polite" aria-busy={busy}>
        {messages.map((message) => (
          <article key={message.id} className={`message ${message.role}`}>
            <strong>{message.role === "user" ? "Ty" : "Chatbot"}</strong>
            {message.parts.map((part, index) => part.type === "text" ? <p key={index}>{part.text}</p> : null)}
          </article>
        ))}
        {busy && <p className="waiting" role="status">{status === "submitted" ? "Czekam na odpowiedź…" : "Chatbot pisze…"}</p>}
      </section>
      {error && <p className="error" role="alert">{/^(Brakuje|Nie|Wpisz) /.test(error.message) ? error.message : "Nie udało się połączyć. Sprawdź połączenie i spróbuj ponownie."}</p>}
      <form onSubmit={(event) => {
        event.preventDefault();
        const text = input.trim();
        if (!text || busy) return;
        clearError();
        setInput("");
        void sendMessage({ text });
      }}>
        <label htmlFor="message">Twoja wiadomość</label>
        <div className="composer">
          <input id="message" name="message" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Napisz wiadomość…" autoComplete="off" disabled={busy} maxLength={20000} />
          <button type="submit" disabled={busy || !input.trim()}>Wyślij <span aria-hidden="true">↗</span></button>
        </div>
        <p className="hint">Chatbot pamięta tę rozmowę do odświeżenia strony. AI może się mylić.</p>
      </form>
    </main>
  );
}
