import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setMessages(await apiRequest("/messages"));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    apiRequest("/messages")
      .then((data) => {
        if (active) setMessages(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function deleteMessage(message) {
    if (!window.confirm(`Delete the message from ${message.name}?`)) return;
    setDeletingId(message.id);
    setError("");
    try {
      await apiRequest(`/messages/${message.id}`, { method: "DELETE" });
      await loadMessages();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="admin-section">
      <header className="admin-section-header">
        <div>
          <p className="admin-eyebrow">Inbox</p>
          <h2>Messages</h2>
        </div>
        <button className="admin-button admin-button-muted" type="button" onClick={loadMessages} disabled={loading}>
          Refresh
        </button>
      </header>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      {loading && <p role="status">Loading messages...</p>}
      {!loading && !error && messages.length === 0 && <p className="admin-panel">No messages yet.</p>}
      <div className="admin-message-list">
        {messages.map((message) => (
          <article className="admin-panel admin-message" key={message.id}>
            <header>
              <div>
                <h3>{message.subject || "No subject"}</h3>
                <p>{message.name} · <a href={`mailto:${message.email}`}>{message.email}</a></p>
              </div>
              <time dateTime={message.created_at}>
                {new Date(message.created_at).toLocaleString()}
              </time>
            </header>
            <p className="admin-message-body">{message.message}</p>
            <button
              className="admin-button admin-button-danger"
              type="button"
              onClick={() => deleteMessage(message)}
              disabled={deletingId === message.id}
            >
              {deletingId === message.id ? "Deleting..." : "Delete message"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}