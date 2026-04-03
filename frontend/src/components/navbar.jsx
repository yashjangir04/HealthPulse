import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import plusIcon from "../assets/plus.svg";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full h-20 md:h-24 flex items-center justify-between px-6 md:px-10 bg-white/70 backdrop-blur-xl z-50 border-b border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">

      <div 
        className="flex items-center gap-3 group cursor-pointer" 
        onClick={() => navigate("/")}
      >
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <img
            src={logo}
            alt="HealthPulse Logo"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex items-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 font-black text-2xl md:text-3xl tracking-tight">
            HealthPulse
          </span>

          <img
            src={plusIcon}
            alt="plus"
            className="w-8 h-8 md:w-10 md:h-10 mb-4 -ml-2 transition-transform duration-500 group-hover:rotate-90"
          />
        </div>
      </div>

      <div className="hidden md:flex gap-6">

      </div>

    </nav>
  );
};

export default Navbar;