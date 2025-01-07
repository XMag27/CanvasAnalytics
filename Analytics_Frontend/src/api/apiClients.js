import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.BACKEND_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (config) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
