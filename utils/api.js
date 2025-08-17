import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 30000, // 30 seconds timeout
});

export const predictEctopic = async (formData) => {
  try {
    const response = await api.post("/predict/ectopic", formData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Prediction failed");
    } else if (error.request) {
      throw new Error("Network error - please check your connection");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const predictMolar = async (formData) => {
  try {
    const response = await api.post("/predict/molar", formData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Prediction failed");
    } else if (error.request) {
      throw new Error("Network error - please check your connection");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export default api;
