/* ================= SAFE TEXT ================= */
export const safeText = (value, fallback = "N/A") => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return value?.name || fallback;
  return value;
};

/* ================= SAFE ARRAY ================= */
export const safeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

/* ================= SAFE IMAGE ================= */
export const getImageUrl = (path, fallback = "/placeholder.jpg") => {
  if (!path) return fallback;

  if (path.startsWith("http")) return path;

  return `http://localhost:5000${path}`;
};