import { useState } from "react";
import { apiRequest, assetUrl } from "../api";

export default function ImageUploadField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(event) {
    const input = event.currentTarget;
    const image = input.files[0];
    if (!image) return;

    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("image", image);

    try {
      const result = await apiRequest("/uploads/images", {
        method: "POST",
        body: formData,
      });
      onChange(result.url);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUploading(false);
      input.value = "";
    }
  }

  return (
    <div className="admin-image-upload">
      <label>
        {label} URL
        <input
          type="text"
          inputMode="url"
          value={value}
          maxLength={2048}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
      <label>
        Upload image (JPG, PNG, WEBP, or GIF; up to 5 MB)
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>
      {uploading && <p role="status">Uploading image...</p>}
      {error && <p className="admin-alert" role="alert">{error}</p>}
      {value && (
        <img className="admin-image-preview" src={assetUrl(value)} alt={`${label} preview`} />
      )}
    </div>
  );
}
