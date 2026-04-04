import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, AlertCircle } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && createPortal(
        <div className="fixed inset-x-0 top-10 flex justify-center z-[10001] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md border ${
            toast.type === "error"
              ? "bg-red-50/90 border-red-200 text-red-600"
              : "bg-white/90 border-emerald-100 text-emerald-600"
          }`}>
            {toast.type === "error"
              ? <AlertCircle size={20} />
              : <CheckCircle size={20} />}
            <span className="font-semibold text-sm tracking-wide">
              {toast.msg}
            </span>
          </div>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};