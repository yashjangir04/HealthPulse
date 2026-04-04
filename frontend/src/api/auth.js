import axios from "axios";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_ROUTE}/api/auth`,
    withCredentials: true,
});

export const getMe = () => API.post("/me");
export const login = (data) => API.post("/login" , data);
export const signupDoctor = (data) => API.post("/signup/doctor" , data);
export const signupPatient = (data) => API.post("/signup/patient" , data);
export const signupShopkeeper = (data) => API.post("/signup/shopkeeper" , data);
export const Logout = () => API.post("/logout");
