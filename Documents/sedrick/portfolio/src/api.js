const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "The request could not be completed.");
    error.status = response.status;
    throw error;
  }

  return data;
}

export function assetUrl(url) {
  if (typeof url !== "string" || !url.startsWith("/uploads/")) return url;
  return `${API_URL.replace(/\/api$/, "")}${url}`;
}
