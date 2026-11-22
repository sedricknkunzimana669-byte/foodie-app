import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../api";
import ImageUploadField from "./ImageUploadField";

function blankRecord(fields) {
  return Object.fromEntries(fields.map((field) => [field.name, ""]));
}

export default function ResourceManager({ endpoint, title, itemLabel, fields }) {
  const [items, setItems] = useState([]);
  const [record, setRecord] = useState(() => blankRecord(fields));
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await apiRequest(endpoint));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    let active = true;
    apiRequest(endpoint)
      .then((data) => {
        if (active) setItems(data);
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
  }, [endpoint]);

  function startEditing(item) {
    setEditingId(item.id);
    setRecord(Object.fromEntries(
      fields.map((field) => [field.name, item[field.name] ?? ""])
    ));
    setNotice("");
  }

  function resetForm() {
    setEditingId(null);
    setRecord(blankRecord(fields));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = Object.fromEntries(fields.map((field) => {
      const value = record[field.name];
      return [
        field.name,
        field.type === "number" ? (value === "" ? null : Number(value)) : value.trim(),
      ];
    }));

    try {
      await apiRequest(
        editingId ? `${endpoint}/${editingId}` : endpoint,
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify(payload),
        }
      );
      resetForm();
      setNotice(`${itemLabel} ${editingId ? "updated" : "added"}.`);
      await loadItems();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete "${item[fields[0].name]}"? This cannot be undone.`)) {
      return;
    }

    setError("");
    setNotice("");
    try {
      await apiRequest(`${endpoint}/${item.id}`, { method: "DELETE" });
      if (editingId === item.id) {
        resetForm();
      }
      setNotice(`${itemLabel} deleted.`);
      await loadItems();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <section className="admin-section">
      <header className="admin-section-header">
        <div>
          <p className="admin-eyebrow">Portfolio content</p>
          <h2>{title}</h2>
        </div>
      </header>

      {error && <p className="admin-alert" role="alert">{error}</p>}
      {notice && <p className="admin-notice" role="status">{notice}</p>}

      <div className="admin-columns">
        <form className="admin-panel admin-form" onSubmit={handleSubmit}>
          <h3>{editingId ? `Edit ${itemLabel.toLowerCase()}` : `Add ${itemLabel.toLowerCase()}`}</h3>
          {fields.map((field) => (
            field.type === "image" ? (
              <ImageUploadField
                key={field.name}
                label={field.label}
                value={record[field.name]}
                onChange={(value) => setRecord({ ...record, [field.name]: value })}
              />
            ) : (
              <label key={field.name}>
                {field.label}
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    rows="4"
                    maxLength={field.maxLength}
                    required={field.required}
                    value={record[field.name]}
                    onChange={(event) => setRecord({ ...record, [field.name]: event.target.value })}
                  />
                ) : (
                  <input
                    name={field.name}
                    type={field.type}
                    min={field.min}
                    max={field.max}
                    maxLength={field.maxLength}
                    required={field.required}
                    value={record[field.name]}
                    onChange={(event) => setRecord({ ...record, [field.name]: event.target.value })}
                  />
                )}
              </label>
            )
          ))}
          <div className="admin-form-actions">
            <button className="admin-button" type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save changes" : `Add ${itemLabel.toLowerCase()}`}
            </button>
            {editingId && (
              <button className="admin-button admin-button-muted" type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="admin-panel">
          <h3>Saved {title.toLowerCase()}</h3>
          {loading && <p role="status">Loading {title.toLowerCase()}...</p>}
          {!loading && !error && items.length === 0 && <p>No items yet.</p>}
          <div className="admin-item-list">
            {items.map((item) => (
              <article className="admin-item" key={item.id}>
                <div>
                  <h4>{item[fields[0].name]}</h4>
                  <p>
                    {fields.slice(1)
                      .map((field) => item[field.name])
                      .filter((value) => value !== null && value !== undefined && value !== "")
                      .join(" · ")}
                  </p>
                </div>
                <div className="admin-item-actions">
                  <button className="admin-button admin-button-muted" type="button" onClick={() => startEditing(item)}>
                    Edit
                  </button>
                  <button className="admin-button admin-button-danger" type="button" onClick={() => handleDelete(item)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
