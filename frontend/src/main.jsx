import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './auth/AuthContext';
import { ToastProvider } from "./components/ToastContext";
import { LanguageProvider } from "./utils/LanguageContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <ToastProvider>
    <LanguageProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LanguageProvider>
  </ToastProvider>
);



















