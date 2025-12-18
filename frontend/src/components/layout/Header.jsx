import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Bell, Menu, User } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
      <div className="flex items-center justify-between h-full px-6">

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 
                     text-slate-700 hover:text-slate-900 hover:bg-slate-100 
                     rounded-xl transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>

        {/* Filler for left alignment on desktop */}
        <div className="hidden md:block"></div>

        {/* Right section */}
        <div className="flex items-center gap-4">

          {/* Notification */}
          <button
            className="relative inline-flex items-center justify-center w-10 h-10
                       text-slate-700 hover:text-slate-900 hover:bg-slate-100 
                       rounded-xl transition-all duration-200 group"
          >
            <Bell
              size={20}
              strokeWidth={2}
              className="group-hover:scale-110 transition-transform duration-200"
            />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* User Profile */}
          <div
            className="flex items-center gap-3 pl-4 border-l border-slate-200/60 cursor-pointer
                       hover:bg-slate-50 rounded-xl px-3 py-2 transition-colors duration-200"
          >
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 
                         flex items-center justify-center text-white shadow-md 
                         shadow-emerald-500/20 group-hover:shadow-lg group-hover:shadow-emerald-500/30 
                         transition-all duration-200"
            >
              <User size={18} strokeWidth={2.5} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                {user?.username || "User"}
              </p>
              <p className="text-xs text-slate-500">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
