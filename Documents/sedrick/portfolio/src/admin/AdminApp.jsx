import { useEffect, useState } from "react";
import { apiRequest } from "../api";
import AdminLogin from "./AdminLogin";
import Dashboard from "./Dashboard";
import "./admin.css";

export default function AdminApp() {
  const [status, setStatus] = useState("checking");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/auth/me")
      .then((admin) => {
        if (active) {
          setEmail(admin.email);
          setStatus("authenticated");
        }
      })
      .catch((requestError) => {
        if (!active) return;
        if (requestError.status === 401) {
          setStatus("unauthenticated");
        } else {
          setError(requestError.message);
          setStatus("error");
        }
      });
    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return <main className="admin-login-page"><p role="status">Checking admin session...</p></main>;
  }

  if (status === "error") {
    return (
      <main className="admin-login-page">
        <section className="admin-panel admin-login-form">
          <h1>Admin unavailable</h1>
          <p className="admin-alert" role="alert">{error}</p>
          <a href="/" className="admin-back-link">Return to portfolio</a>
        </section>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <AdminLogin
        onLogin={(adminEmail) => {
          setEmail(adminEmail);
          setStatus("authenticated");
        }}
      />
    );
  }

  return (
    <Dashboard
      email={email}
      onLogout={() => {
        setEmail("");
        setStatus("unauthenticated");
      }}
    />
  );
}
