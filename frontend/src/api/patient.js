import axios from "axios"
const API = axios.create({
    baseURL: "http://localhost:5000/api/auth",
    withCredentials: true,
});
// GET
export const getContacts = () =>
  API.get("/api/patient/contacts");

// ADD
export const addContactAPI = (data) =>
  API.post("/api/patient/add-contact", data);

// DELETE
export const deleteContactAPI = (phoneNumber) =>
  API.delete("/api/patient/delete-contact", {
    data: { phoneNumber },
  });