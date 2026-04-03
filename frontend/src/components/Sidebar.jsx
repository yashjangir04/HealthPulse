import React from "react";
import { NavLink } from "react-router-dom";
import { User, Calendar, FileText } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import {
    User,
    Sparkles,
    FileText,
    Users,
    Bell,
    UserRound,
    LogOut,
    ChevronLeft,
    ChevronRight,
    LogIn,
    Calendar,
    ShoppingBag, 
  } from "lucide-react";
const Sidebar = (
    {
        isCollapsed,
        setIsCollapsed,
        isOpen,
        setIsOpen,
        isFullHeighted,
      }
) => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout(); 
      navigate("/"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const getMenuItems = () => {

    const allItems = {
      profile: { icon: <User size={20} />, label: "Profile", path: "/profile" },
      aiHelp: { icon: <Sparkles size={20} />, label: "AI Help", path: "/ai-help" },
      reports: { icon: <FileText size={20} />, label: "Reports", path: "/reports" },
      contacts: { icon: <Users size={20} />, label: "Contacts", path: "/contact" },
      reminder: { icon: <Bell size={20} />, label: "Reminder", path: "/medi-list" },
      appointments: { icon: <Calendar size={20} />, label: "Appointments", path: "/appointments" },
      connect: { icon: <UserRound size={20} />, label: "Connect", path: "/connect" },
      shopkeeperOrders: { icon: <ShoppingBag size={20} />, label: "Orders", path: "/shopkeeper/orders" }, 
      patientOrders: { icon: <ShoppingBag size={20} />, label: "My Orders", path: "/patient/orders" }, 
    };


    switch (user?.role) {
      case "doctor":
        return [
          allItems.profile,
          allItems.appointments,
          allItems.connect,
        ];
      case "shopkeeper":
        return [
          allItems.profile,
          allItems.shopkeeperOrders,
        ];
      case "patient":
      default:
      
        return [
          allItems.profile,
          allItems.aiHelp,
          allItems.reports,
          allItems.contacts,
          allItems.reminder,
          allItems.appointments,
          allItems.connect,
          allItems.patientOrders, 
        ];
    }
  };

 
  const menuItems = getMenuItems();
  return (
    <>
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-45 lg:hidden"
        onClick={() => setIsOpen(false)}
      />
    )}
    <aside        className={`fixed left-0 z-40 lg:z-50 flex flex-col justify-between py-6 
                    transition-all duration-500 ease-in-out
                    bg-white backdrop-blur-xl border-r border-gray-100

                    /* Mobile defaults */
                    top-0 h-screen pt-20 md:pt-10

                    /* Width logic */
                    w-16 ${isOpen ? "w-72 shadow-2xl" : ""}
                    ${isCollapsed ? "lg:w-16" : "lg:w-64"}

                    /* Desktop Full-Height vs Gap Logic */
                    ${
                      isFullHeighted
                          ? "lg:top-0 lg:h-screen lg:pt-6"
                          : "lg:top-24 lg:h-[calc(100vh-6rem)]"
                      }
        `}>
                   <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-4 bg-white border border-gray-100 rounded-full p-1 shadow-lg hover:bg-blue-50 transition-colors z-60"
        >
          {isCollapsed ? (
            <ChevronRight size={16} className="text-blue-600" />
          ) : (
            <ChevronLeft size={18} className="text-blue-600" />
          )}
        </button>
 {/* NavLinks to menu items */}
        <div className="space-y-1 px-3">
          {menuItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-4 px-3 py-2.5 rounded-2xl cursor-pointer transition-all duration-300 group
                ${isActive 
                  ? "bg-[#3F87F7] text-white shadow-xl shadow-blue-200" 
                  : "font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600"}
                ${isCollapsed && !isOpen ? "justify-center" : ""}
              `}
            >
              <div className="transition-transform group-hover:scale-110">
                {item.icon}
              </div>
              {(isOpen || !isCollapsed) && (
                <span className="text-[15px] font-bold whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </div>

    </aside>
    </>
  );
};

export default Sidebar;