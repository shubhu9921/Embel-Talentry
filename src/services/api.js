import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api", // ✅ backend URL
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Attach JWT token automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Global response error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized! Redirect to login.");
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default api;