const BASE_URL = "http://localhost:5000/api";

/* ================= GET TOKEN ================= */
const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

/* ================= HANDLE AUTH ERROR ================= */
const handleAuthError = (status) => {
  if (status === 401) {
    console.warn("🔒 Unauthorized - redirecting to login");

    // optional auto logout (recommended for production)
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
};

/* ================= HEADERS ================= */
const getHeaders = (isFormData = false) => {
  const token = getToken();

  const headers = {
    Authorization: token ? `Bearer ${token}` : "",
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

/* ================= SAFE RESPONSE PARSER ================= */
const parseResponse = async (response) => {
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: "Invalid JSON response from server",
    };
  }
};

/* ================= API WRAPPER ================= */
export const api = async (endpoint, options = {}) => {
  try {
    const isFormData = options.body instanceof FormData;

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(isFormData),
        ...options.headers,
      },
    });

    const data = await parseResponse(response);

    /* 🔥 HANDLE AUTH ISSUES GLOBALLY */
    if (!response.ok) {
      handleAuthError(response.status);
      throw new Error(data?.message || "API Error");
    }

    return data;
  } catch (error) {
    console.error("❌ API ERROR:", error.message);
    throw error;
  }
};

/* ================= OPTIONAL HELPERS (VERY USEFUL) ================= */

/* GET */
api.get = (url) => api(url);

/* POST */
api.post = (url, body) =>
  api(url, {
    method: "POST",
    body: JSON.stringify(body),
  });

/* PUT */
api.put = (url, body) =>
  api(url, {
    method: "PUT",
    body: JSON.stringify(body),
  });

/* DELETE */
api.delete = (url) =>
  api(url, {
    method: "DELETE",
  });