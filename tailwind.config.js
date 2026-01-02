import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserCircle, Sun, Moon } from "lucide-react";
import { toggleTheme } from "../store/slices/themeSlice"; // Import action

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme); // Get theme state
  const dispatch = useDispatch();

  return (
    <header
      className="h-16 fixed top-0 right-0 left-64 z-40 px-8 flex items-center justify-between transition-all duration-300
      bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
    >
      <h2 className="text-lg font-semibold">
        Welcome back, {user?.name || "Admin"}
      </h2>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {mode === "dark" ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600" />
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
          <UserCircle className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
