import axios from "axios"
const API = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_ROUTE}/api/doctors`,
    withCredentials: true,
});

// GET
export const getDoctors = () =>
  API.get("/get-doctors");

// POST
export const rateDoctor = (doctorId, data) =>
  API.post(`/${doctorId}/rate`, data);
