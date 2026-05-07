import axios from "axios";

const API_URL = axios.create({
  baseURL: "https://student-attendance-back.onrender.com/api/",
});

API_URL.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API_URL.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // ❌ កុំប្រើ window.location.href
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API_URL;