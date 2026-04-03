import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import plusIcon from "../assets/plus.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full h-20 md:h-24 flex items-center justify-between px-6 md:px-10 bg-white/70 backdrop-blur-xl z-50 border-b border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">

      <div 
        className="flex items-center gap-3 group cursor-pointer" 
        onClick={() => {
          navigate("/");
          setIsMenuOpen(false);
        }}
      >
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex items-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 font-black text-2xl md:text-3xl tracking-tight">
            HealthPulse
          </span>
          <img src={plusIcon} alt="plus" className="w-8 h-8 md:w-10 md:h-10 mb-4 -ml-2 transition-transform duration-500 group-hover:rotate-90" />
        </div>
      </div>

      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden p-2 text-gray-600 hover:text-blue-600 focus:outline-none transition-colors z-50"
        aria-label="Toggle menu"
      >
        <div className="relative w-6 h-5">
          <span className={`absolute left-0 w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? "top-2 rotate-45" : "top-0"}`}></span>
          <span className={`absolute left-0 top-2 w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}></span>
          <span className={`absolute left-0 w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? "top-2 -rotate-45" : "top-4"}`}></span>
        </div>
      </button>

      <div
        className={`${
          isMenuOpen
            ? "absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl flex flex-col p-6 animate-in slide-in-from-top duration-300"
            : "hidden"
        } lg:flex lg:flex-row lg:static lg:w-auto lg:bg-transparent lg:border-none lg:shadow-none items-center lg:space-x-4`}
      >
        <ul className="flex flex-col lg:flex-row items-center w-full lg:w-auto space-y-4 lg:space-y-0 lg:space-x-2">
          <li className="w-full lg:w-auto">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block w-full text-center px-5 py-2.5 rounded-full text-[15px] font-bold transition-all duration-300 ${
                location.pathname === "/"
                  ? "text-blue-700 bg-blue-50 shadow-sm"
                  : "text-gray-500 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Home
            </Link>
          </li>
          <li className="w-full lg:w-auto">
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className={`block w-full text-center px-5 py-2.5 rounded-full text-[15px] font-bold transition-all duration-300 ${
                location.pathname === "/about"
                  ? "text-blue-700 bg-blue-50 shadow-sm"
                  : "text-gray-500 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              About Us
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;