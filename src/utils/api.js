const BASE_URL = "http://localhost:5000";

// 🔥 MAIN API FUNCTION
const API = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {})
    },
    ...options
  };

  try {
    const res = await fetch(`${BASE_URL}${url}`, config);

    // 🔐 HANDLE AUTH ERRORS
    if (res.status === 401 || res.status === 403) {
      localStorage.clear();
      window.location.href = "/login";
      throw new Error("Session expired");
    }

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!res.ok) {
      throw new Error(data?.error || data || "Request failed");
    }

    return data;

  } catch (err) {
    console.error("API ERROR:", err.message);
    throw err;
  }
};

export default API;

export const GET = (url) => API(url);

export const POST = (url, body) =>
  API(url, {
    method: "POST",
    body: JSON.stringify(body)
  });

export const PUT = (url, body) =>
  API(url, {
    method: "PUT",
    body: JSON.stringify(body)
  });

export const DELETE = (url) =>
  API(url, {
    method: "DELETE"
  });