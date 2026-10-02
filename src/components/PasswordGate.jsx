import React, { useState } from "react";

export default function PasswordGate({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError("Galat password — dubara try karo.");
        return;
      }
      sessionStorage.setItem("broll_password", password);
      onUnlock(password);
    } catch (e) {
      setError("Kuch gadbad hui — dobara try karo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="upload-screen">
      <div className="upload-card">
        <h1>
          B-Roll <span className="brandword">Picker</span>
        </h1>
        <p>Password daalo andar jaane ke liye.</p>
        <form onSubmit={submit}>
          <input
            type="password"
            className="password-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <button className="accent" style={{ width: "100%", marginTop: 12 }} disabled={loading}>
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
        {error && <div className="error-text">{error}</div>}
      </div>
    </div>
  );
}
