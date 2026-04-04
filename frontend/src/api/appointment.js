import axios from "axios";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_ROUTE}/api/appointments`,
    withCredentials: true,
});

export const getAppointments = () => API.post("/get-appointments") ;
export const endAppointment = (data) => API.post("/end-appointment" , data) ;
export const cancelAppointment = (data) => API.post("/cancel-appointment" , data) ;
export const scheduleAppointment = (data) => API.post("/schedule-appointment" , data) ;
export const rescheduleAppointment = (data) => API.post("/reschedule-appointment" , data) ;
export const updateAppointmentStatus = (data) => API.post("/update-appointment-status" , data) ;
export const getAppointmentDetails = (data) => API.post("/get-appointment-details" , data) ;
export const getMedicines = (data) => API.post("/get-medicines" , data) ;

