import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut, LogIn, Sparkles } from "lucide-react";
import logo from "../assets/logo.svg";
import plusIcon from "../assets/plus.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const modalRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOpenModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="fixed top-0 w-full h-20 md:h-24 flex items-center justify-between px-6 md:px-10 bg-white/70 backdrop-blur-xl z-100 border-b border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
      
      {/* Brand & Logo */}
      <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/")}>
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <img
            src={logo}
            alt="HealthPulse Logo"
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>
        <div className="relative flex items-center">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-indigo-600 font-black text-2xl md:text-3xl tracking-tight">
            HealthPulse
          </span>
          <img
            src={plusIcon}
            alt="plus"
            className="w-8 h-8 md:w-10 md:h-10 object-contain mb-4 -ml-2 transition-transform duration-500 group-hover:rotate-90"
          />
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden p-2 text-gray-600 hover:text-blue-600 focus:outline-none transition-colors"
        aria-label="Toggle menu"
      >
        <div className="relative w-6 h-5">
          <span className={`absolute left-0 w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? "top-2 rotate-45" : "top-0"}`}></span>
          <span className={`absolute left-0 top-2 w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}></span>
          <span className={`absolute left-0 w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? "top-2 -rotate-45" : "top-4"}`}></span>
        </div>
      </button>

      {/* Navigation & Actions */}
      <div
        className={`${
          isMenuOpen
            ? "absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl flex p-6"
            : "hidden"
        } lg:flex flex-col lg:flex-row lg:static lg:w-auto lg:bg-transparent lg:border-none lg:shadow-none items-center space-y-6 lg:space-y-0 lg:space-x-10`}
      >
        {/* Main Links */}
        <ul className="flex flex-col lg:flex-row items-center w-full lg:w-auto space-y-4 lg:space-y-0 lg:space-x-2">
          <li className="w-full lg:w-auto">
            <Link
              to="/"
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

        {/* Auth Section */}
        <div className="w-full lg:w-auto border-t lg:border-none border-gray-100 pt-6 lg:pt-0 flex justify-center">
          {isLoggedIn ? (
            <div className="relative">
              <div 
                onClick={() => setOpenModal(!openModal)} 
                className="w-10 h-10 md:w-11 md:h-11 rounded-full cursor-pointer bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white shadow-[0_4px_10px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                {user?.name?.charAt(0).toUpperCase() || <User size={20} />}
              </div>

              {/* Profile Dropdown */}
              <div
                className={`absolute right-0 top-full mt-4 w-56 bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden z-110 transition-all duration-300 transform origin-top-right ${openModal ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                ref={modalRef}
              >
                <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                  <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || "User Account"}</p>
                  <p className="text-xs font-medium text-gray-500 truncate">{user?.email || "Manage your profile"}</p>
                </div>
                
                <div className="p-2">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpenModal(false);
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-gray-600 cursor-pointer font-semibold text-sm hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-3"
                  >
                    <User size={16} className="text-blue-500" /> Dashboard
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setOpenModal(false);
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-red-600 cursor-pointer font-semibold text-sm hover:bg-red-50 transition-colors flex items-center gap-3 mt-1"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-4 w-full lg:w-auto">
              <Link
                to="/account/login"
                className="w-full lg:w-auto text-center px-6 py-2.5 rounded-full text-[15px] font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
              >
                Sign In
              </Link>

              <Link
                to="/account/register"
                className="group relative w-full lg:w-auto text-center px-7 py-2.5 rounded-full text-[15px] font-bold text-white bg-linear-to-r from-primary to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-[0_6px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_8px_25px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get Started
                <Sparkles size={16} className="opacity-70 group-hover:animate-pulse" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;