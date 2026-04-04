import axios from "axios"
const API = axios.create({
    baseURL: "http://localhost:5000/api/doctors",
    withCredentials: true,
});

// GET
export const getDoctors = () =>
  API.get("/get-doctors");
