import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/Sidebar';
import VoiceAssistant from '../components/VoiceAssistant';

const MainLayout = ({ children, showNavbar = true, showSidebar = true, isFullHeighted = true }) => {
  // initialize state from localStorage so it remembers the user's choice across pages
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // If no saved preference, default to true on mobile, false on desktop
    return window.innerWidth < 1024;
  });

  const [isOpen, setIsOpen] = useState(false);

  // Save to localStorage whenever the user toggles the sidebar
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // Force collapse and close overlay on mobile
        setIsCollapsed(true);
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar setIsOpen={setIsOpen} />}

      <div className={`flex flex-1 flex-row ${showNavbar ? 'pt-0 md:pt-0' : ''}`}>
        {showSidebar && (
          <Sidebar 
            isCollapsed={isCollapsed} 
            setIsCollapsed={setIsCollapsed}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isFullHeighted={isFullHeighted}
          />
        )}

        <main 
          className={`flex-1 transition-all duration-300 ease-in-out relative z-0 
            ${showNavbar ? 'min-h-[calc(100vh-6rem)]' : 'min-h-screen'}
            
            ${showSidebar 
              ? (isCollapsed ? 'ml-16 lg:ml-16' : 'ml-16 lg:ml-64') 
              : 'ml-0'
            }
          `}
        >
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
      <VoiceAssistant />
    </div>
  );
};

export default MainLayout;