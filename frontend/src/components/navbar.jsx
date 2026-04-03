import React, { useState, useRef } from "react"; // Added useRef here
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import plusIcon from "../assets/plus.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const modalRef = useRef(null);

  const user = { name: "Yash", email: "yash@healthpulse.com" };
  const logout = () => setIsLoggedIn(false);

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
        } lg:flex lg:flex-row lg:static lg:w-auto lg:bg-transparent lg:border-none lg:shadow-none items-center lg:space-x-8`}
      >
        <ul className="flex flex-col lg:flex-row items-center w-full lg:w-auto space-y-4 lg:space-y-0 lg:space-x-2">
          <li>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-5 py-2.5 rounded-full text-[15px] font-bold transition-all duration-300 ${
                location.pathname === "/" ? "text-blue-700 bg-blue-50" : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-5 py-2.5 rounded-full text-[15px] font-bold transition-all duration-300 ${
                location.pathname === "/about" ? "text-blue-700 bg-blue-50" : "text-gray-500 hover:text-blue-600"
              }`}
            >
              About Us
            </Link>
          </li>
        </ul>

        <div className="border-t lg:border-none border-gray-100 pt-6 lg:pt-0">
          {isLoggedIn ? (
            <div className="relative">
              <div 
                onClick={() => setOpenModal(!openModal)} 
                className="w-10 h-10 md:w-11 md:h-11 rounded-full cursor-pointer bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white shadow-lg hover:scale-105 transition-all"
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div
                className={`absolute right-0 top-full mt-4 w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-50 transition-all duration-300 transform origin-top-right ${
                  openModal ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                }`}
                ref={modalRef}
              >
                <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="p-2">
                  <button onClick={() => {navigate("/profile"); setOpenModal(false);}} className="w-full text-left px-4 py-2.5 rounded-xl text-gray-600 font-semibold text-sm hover:bg-blue-50 transition-colors">
                    Dashboard
                  </button>
                  <button onClick={() => {logout(); setOpenModal(false); navigate("/");}} className="w-full text-left px-4 py-2.5 rounded-xl text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors mt-1">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row items-center gap-3">
              <Link to="/login" className="px-6 py-2.5 text-[15px] font-bold text-gray-600 hover:text-blue-600 transition-all">
                Sign In
              </Link>
              <button
                onClick={() => setIsLoggedIn(true)}
                className="px-7 py-2.5 rounded-full text-[15px] font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;