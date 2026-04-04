import axios from "axios";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_AI_ROUTE}/api`,
    withCredentials: "true"
})

export const populateDB = (data) => API.post('/personal', data);
export const askQuestion = (data) => API.post('/chat', data);
export const resetDB = () => API.post('/reset-db');