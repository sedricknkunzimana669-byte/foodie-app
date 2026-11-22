import { useEffect, useState } from "react";
import { apiRequest } from "../api";
import ImageUploadField from "./ImageUploadField";

const emptyProfile = {
  name: "",
  profession: "",
  email: "",
  location: "",
  bio: "",
  photo_url: "",
};

const fields = [
  { name: "name", label: "Name", type: "text", required: true, maxLength: 150 },
  { name: "profession", label: "Profession", type: "text", required: true, maxLength: 150 },
  { name: "email", label: "Email", type: "email", required: true, maxLength: 254 },
  { name: "location", label: "Location", type: "text", maxLength: 150 },
  { name: "photo_url", label: "Profile photo", type: "image", maxLength: 2048 },
];

export default function ManageProfile() {
  const [profile, setProfile] = useState(emptyProfile);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/profile")
      .then((data) => {
        if (active && data) {
          setProfile({ ...emptyProfile, ...data });
          setBio(data.bio || "");
        }
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

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const result = await apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify({ ...profile, bio }),
      });
      setProfile({ ...emptyProfile, ...result.profile });
      setBio(result.profile.bio || "");
      setNotice(result.message);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-section">
      <header className="admin-section-header">
        <div>
          <p className="admin-eyebrow">Portfolio content</p>
          <h2>Profile</h2>
        </div>
      </header>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      {notice && <p className="admin-notice" role="status">{notice}</p>}
      <form className="admin-panel admin-form admin-profile-form" onSubmit={handleSubmit}>
        {loading && <p role="status">Loading profile...</p>}
        {fields.map((field) => (
          field.type === "image" ? (
            <ImageUploadField
              key={field.name}
              label={field.label}
              value={profile[field.name]}
              onChange={(value) => setProfile({ ...profile, [field.name]: value })}
            />
          ) : (
            <label key={field.name}>
              {field.label}
              <input
                type={field.type}
                name={field.name}
                required={field.required}
                maxLength={field.maxLength}
                value={profile[field.name]}
                onChange={(event) => setProfile({ ...profile, [field.name]: event.target.value })}
              />
            </label>
          )
        ))}
        <label>
          About
          <textarea
            name="bio"
            rows="6"
            maxLength="5000"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
          />
        </label>
        <button className="admin-button" type="submit" disabled={saving || loading}>
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </section>
  );
}