"use client";

export default function Home() {
  return (
    <main className="chat">
      <header>
        <p className="eyebrow">LABA · PIERWSZY KROK</p>
        <h1>Mój chatbot</h1>
        <p className="subtitle">Twoje miejsce na rozmowę.</p>
      </header>
      <section className="conversation" role="log" aria-label="Rozmowa" aria-live="polite" />
      <form onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="message">Twoja wiadomość</label>
        <div className="composer">
          <input id="message" name="message" placeholder="Napisz wiadomość…" autoComplete="off" />
          <button type="submit">Wyślij <span aria-hidden="true">↗</span></button>
        </div>
        <p className="hint">To początek — odpowiedzi AI dodamy w kolejnym kroku.</p>
      </form>
    </main>
  );
}
