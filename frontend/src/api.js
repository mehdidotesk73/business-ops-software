import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

// const apiUrl = "/choreo-apis/business-ops-software/backend/v1";
const apiUrl =
  "https://592cc7be-b783-4230-8f0e-70e83047c705-prod.e1-us-east-azure.choreoapis.dev/business-ops-software/backend/v1.0";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("Here!");
    return Promise.reject(error);
  }
);

export default api;
