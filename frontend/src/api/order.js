import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:5000/api/orders' ,
    withCredentials: true , 
})

export const createOrder = (data) => API.post('/create-order-request' , data) ;
export const getAllActiveOrders = () => API.post('/get-all-active-orders') ;
export const addResponseToOrder = (data) => API.post('/add-response-to-order' , data) ;
export const getPatientOrders = () => API.post('/get-patient-orders') ;
export const acceptOrder = (data) => API.post('/accept-order' , data) ;