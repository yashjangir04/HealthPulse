import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import logo from '../assets/logo.svg'; 
import plusIcon from '../assets/plus.svg';

const Footer = () => {
  return (
    <footer className="w-full bg-transparent">
      <div className="w-full bg-white p-8 sm:p-12 md:p-16 lg:p-20 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] border-t border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          <div className="flex flex-col items-start lg:col-span-4 pr-0 lg:pr-10">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="HealthPulse" className="w-12 md:w-14 h-auto" />
              <div className="relative flex items-center">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 font-black text-2xl md:text-3xl tracking-tight">
                  HealthPulse
                </span>
                <img
                  src={plusIcon}
                  alt="plus"
                  className="w-8 h-8 md:w-10 md:h-10 object-contain mb-4 -ml-2"
                />
              </div>
            </div>
            
            <p className="text-gray-500 mb-8 leading-relaxed font-medium">
              Empowering your healthcare journey with modern, intuitive, and secure digital health solutions.
            </p>
            
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1">
                <FaFacebookF className="text-sm" />
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1">
                <FaTwitter className="text-sm" />
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1">
                <FaInstagram className="text-sm" />
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1">
                <FaLinkedinIn className="text-sm" />
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1">
                <FaYoutube className="text-sm" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-gray-900 font-bold text-lg mb-6 tracking-wide">Product</h4>
            <ul className="space-y-4 text-gray-500 font-medium">
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Features</span></li>
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Pricing</span></li>
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Case studies</span></li>
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Reviews</span></li>
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Updates</span></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-gray-900 font-bold text-lg mb-6 tracking-wide">Support</h4>
            <ul className="space-y-4 text-gray-500 font-medium">
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Getting started</span></li>
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Help center</span></li>
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Server status</span></li>
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Report a bug</span></li>
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Chat support</span></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-gray-900 font-bold text-lg mb-6 tracking-wide">Contact Us</h4>
            <ul className="space-y-5 text-gray-500 font-medium">
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
                  <FaEnvelope className="text-sm" />
                </div>
                <span className="text-[15px] group-hover:text-blue-600 transition-colors break-all">connect.healthpulse@gmail.com</span>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
                  <FaPhoneAlt className="text-sm" />
                </div>
                <span className="text-[15px] group-hover:text-blue-600 transition-colors">+91 - 9783450326</span>
              </li>
              <li className="flex items-start gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0 mt-1">
                  <FaMapMarkerAlt className="text-sm" />
                </div>
                <span className="text-[15px] leading-relaxed group-hover:text-blue-600 transition-colors">
                  Academic Block, IIIT Kota<br />Rajasthan, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left text-gray-400 font-medium text-sm">
          <p>Copyright © 2026 HealthPulse. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <span className="hover:text-blue-600 transition-colors cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-blue-600 transition-colors cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;