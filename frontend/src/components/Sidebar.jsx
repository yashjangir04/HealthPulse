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
    <aside className="w-64 h-screen bg-white border-r p-4">

      <nav className="space-y-3">

        <NavLink to="/profile" className="flex gap-2 items-center">
          <User size={18} /> Profile
        </NavLink>

        <NavLink to="/appointments" className="flex gap-2 items-center">
          <Calendar size={18} /> Appointments
        </NavLink>

        <NavLink to="/reports" className="flex gap-2 items-center">
          <FileText size={18} /> Reports
        </NavLink>

      </nav>

    </aside>
  );
};

export default Sidebar;