import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, MapPin, Settings, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Users, label: "Staff", path: "/staff" },
    { icon: MapPin, label: "Locations", path: "/locations" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside
      className="w-64 border-r h-screen fixed left-0 top-0 flex flex-col z-50 transition-all duration-300 
      bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-600/20">
            A
          </div>
          <span className="text-xl font-bold tracking-tight">AdminPanel</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto mt-2">
        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Overview
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 w-full rounded-xl transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
