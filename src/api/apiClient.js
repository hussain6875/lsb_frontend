export const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getImageUrl = (path) => `${baseURL}${path}`;

export const apiClient = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(!isFormData && { "Content-Type": "application/json" }),  // ✅ JSON ആണെങ്കിൽ മാത്രം ചേർക്കുക
  };

  const response = await fetch(`${baseURL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "API error occurred");
  }

  return response.json();
};
