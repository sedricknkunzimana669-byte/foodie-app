import { useState } from "react";
import { apiRequest } from "../api";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const admin = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      onLogin(admin.email);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <form className="admin-panel admin-login-form" onSubmit={handleSubmit}>
        <p className="admin-eyebrow">Portfolio administration</p>
        <h1>Sign in</h1>
        <p>Use your administrator credentials to manage portfolio content.</p>
        {error && <p className="admin-alert" role="alert">{error}</p>}
        <label>
          Email
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button className="admin-button" type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
        <a href="/" className="admin-back-link">Return to portfolio</a>
      </form>
    </main>
  );
}
