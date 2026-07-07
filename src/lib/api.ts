import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const Api = {
  get: async (url: string, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get(url, config);
    return response.data;
  },

  post: async (url: string, data: unknown, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.post(url, data, config);
    return response.data;
  },

  put: async (url: string, data: unknown, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.put(url, data, config);
    return response.data;
  },

  delete: async (url: string) => {
    const response = await api.delete(url);
    return response.data;
  },
};