import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import logo from '../assets/logo.svg'; 
import plusIcon from '../assets/plus.svg';
import { useLanguage } from '../utils/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
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
              {t("footerDesc")}
            </p>
            
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1">
                <FaFacebookF className="text-sm" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1">
                <FaTwitter className="text-sm" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1">
                <FaInstagram className="text-sm" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1">
                <FaLinkedinIn className="text-sm" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1">
                <FaYoutube className="text-sm" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-gray-900 font-bold text-lg mb-6 tracking-wide">{t("product")}</h4>
            <ul className="space-y-4 text-gray-500 font-medium">
              <li><a href="#features" className="hover:text-blue-600 transition-colors cursor-pointer">{t("features")}</a></li>
              <li><a href="#pricing" className="hover:text-blue-600 transition-colors cursor-pointer">{t("pricing")}</a></li>
              <li><a href="#case-studies" className="hover:text-blue-600 transition-colors cursor-pointer">{t("caseStudies")}</a></li>
              <li><a href="#reviews" className="hover:text-blue-600 transition-colors cursor-pointer">{t("reviews")}</a></li>
              <li><a href="#updates" className="hover:text-blue-600 transition-colors cursor-pointer">{t("updates")}</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-gray-900 font-bold text-lg mb-6 tracking-wide">{t("support")}</h4>
            <ul className="space-y-4 text-gray-500 font-medium">
              <li><a href="#getting-started" className="hover:text-blue-600 transition-colors cursor-pointer">{t("gettingStarted")}</a></li>
              <li><a href="#help-center" className="hover:text-blue-600 transition-colors cursor-pointer">{t("helpCenter")}</a></li>
              <li><a href="#server-status" className="hover:text-blue-600 transition-colors cursor-pointer">{t("serverStatus")}</a></li>
              <li><a href="#report-bug" className="hover:text-blue-600 transition-colors cursor-pointer">{t("reportBug")}</a></li>
              <li><a href="#chat-support" className="hover:text-blue-600 transition-colors cursor-pointer">{t("chatSupport")}</a></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-gray-900 font-bold text-lg mb-6 tracking-wide">{t("contactUs")}</h4>
            <ul className="space-y-5 text-gray-500 font-medium">
              <li className="group cursor-pointer">
                <a href="mailto:connect.healthpulse@gmail.com" className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
                    <FaEnvelope className="text-sm" />
                  </div>
                  <span className="text-[15px] group-hover:text-blue-600 transition-colors break-all">connect.healthpulse@gmail.com</span>
                </a>
              </li>
              <li className="group cursor-pointer">
                <a href="tel:+919783450326" className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
                    <FaPhoneAlt className="text-sm" />
                  </div>
                  <span className="text-[15px] group-hover:text-blue-600 transition-colors">+91 - 97834 50326</span>
                </a>
              </li>
              <li className="group cursor-pointer">
                <a href="https://www.google.com/maps/search/?api=1&query=IIIT+Kota+Rajasthan+India" target="_blank" rel="noreferrer" className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0 mt-1">
                    <FaMapMarkerAlt className="text-sm" />
                  </div>
                  <span className="text-[15px] leading-relaxed group-hover:text-blue-600 transition-colors">
                    Academic Block, IIIT Kota<br />Rajasthan, India
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left text-gray-400 font-medium text-sm">
          <p>{t("copyright")}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#terms" className="hover:text-blue-600 transition-colors cursor-pointer">{t("termsConditions")}</a>
            <a href="#privacy" className="hover:text-blue-600 transition-colors cursor-pointer">{t("privacyPolicy")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;