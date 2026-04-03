import React from "react";
import { NavLink } from "react-router-dom";
import { User, Calendar, FileText } from "lucide-react";

const Sidebar = () => {
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