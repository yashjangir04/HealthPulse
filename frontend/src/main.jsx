import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './auth/AuthContext';
import { ToastProvider } from "./components/ToastContext";

// import {AppProvider} from './context/AppContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <ToastProvider>
    <AuthProvider>

      <App />
    
    </AuthProvider>
  </ToastProvider>
    
  // </React.StrictMode>  
);



















