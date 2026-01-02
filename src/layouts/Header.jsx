import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Sun, Moon, Bell, Search, Menu } from "lucide-react";
import { toggleTheme } from "../store/slices/themeSlice";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  return (
    <header
      className="h-16 fixed top-0 right-0 left-64 z-40 px-6 flex items-center justify-between transition-all duration-300
      bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800"
    >
      {/* Search Bar */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-indigo-500/50 transition-all">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 dark:text-slate-200 placeholder-slate-400"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
        >
          {mode === "dark" ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600" />
          )}
        </button>

        {/* Notifications */}
        <button className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
        </button>

        {/* Profile Divider */}
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

        {/* Profile Info */}
        <div className="flex items-center gap-3 pl-1 cursor-pointer">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-none">
              {user?.name || "Admin User"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Administrator
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
              <span className="font-bold text-indigo-600 text-sm">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
