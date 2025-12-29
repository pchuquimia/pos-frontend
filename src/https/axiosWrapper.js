import axios from "axios";

const defaultHeader = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const axiosWrapper = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // <- NOMBRE CORRECTO
  withCredentials: true, // <- CLAVE para cookies
  headers: { ...defaultHeader },
});

// Auth
export const login = (data) => axiosWrapper.post("/api/user/login", data);
export const register = (data) => axiosWrapper.post("/api/user/register", data);
export const logout = () => axiosWrapper.post("/api/user/logout");
export const getMe = () => axiosWrapper.get("/api/user/me");
