import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  FileText,
  Layers,
  LayoutDashboard,
  LogOut,
  User,
  X,
  SquarePen,
  Hash,
  Image,
  Globe,
  Eraser,
  Scissors,
  Code2,
  BarChart,
  CodeXml,
  BookOpen,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },

        { to: "/documents", icon: FileText, text: "Documents" },
        { to: "/flashcards", text: "Flashcards", icon: Layers },


        { to: "/write-article", text: "Write Article", icon: Hash },
        
    { to: "/generate-images", icon: Globe, text: "Generate Images" },
    // {
    //   label: "Code Tools",
    //   Icon: Code2,
    //   subLinks: [
    //     { to: "/explain-code", label: "Explain Code", Icon: Layers },
    //     { to: "/code-convert", label: "Convert Code", Icon: BarChart },
    //     { to: "/code-optimize", label: "Optimize Code", Icon: CodeXml },
    //   ],
    // },
    { to: "/profile", icon: User, text: "Profile" },
  ];

  const toggleSubMenu = (label) => {
    setOpenSubMenu(openSubMenu === label ? null : label);
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-lg border-r border-slate-200/60 z-50 
        md:relative md:w-64 md:shrink-0 md:translate-x-0 
        transition-transform duration-300 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full justify-between">
          {/* Top Section */}
          <div>
            <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-md shadow-emerald-500/20">
                  <BrainCircuit
                    className="text-white"
                    size={20}
                    strokeWidth={2.5}
                  />
                </div>
                <h1 className="text-lg font-semibold">Creona.AI</h1>
              </div>

              <button className="md:hidden" onClick={toggleSidebar}>
                <X size={24} />
              </button>
            </div>

            <nav className="px-3 py-4 space-y-1">
              {navLinks.map((link, idx) => (
                <div key={idx}>
                  {!link.subLinks ? (
                    <NavLink
                      to={link.to}
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <link.icon
                            size={18}
                            strokeWidth={2.5}
                            className={`transition-transform duration-200 ${
                              isActive ? "" : "group-hover:scale-110"
                            }`}
                          />
                          {link.text}
                        </>
                      )}
                    </NavLink>
                  ) : (
                    <div>
                      <button
                        onClick={() => toggleSubMenu(link.label)}
                        className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-semibold text-slate-700 rounded-xl hover:bg-slate-100 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <link.Icon size={18} strokeWidth={2.5} />
                          {link.label}
                        </div>
                        {openSubMenu === link.label ? (
                          <ChevronUp size={16} strokeWidth={2.5} />
                        ) : (
                          <ChevronDown size={16} strokeWidth={2.5} />
                        )}
                      </button>

                      {openSubMenu === link.label && (
                        <div className="ml-6 mt-1 flex flex-col space-y-1">
                          {link.subLinks.map((subLink) => (
                            <NavLink
                              key={subLink.to}
                              to={subLink.to}
                              onClick={toggleSidebar}
                              className={({ isActive }) =>
                                `group flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                                  isActive
                                    ? "bg-linear-to-r from-emerald-400 to-teal-400 text-white shadow"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`
                              }
                            >
                              <subLink.Icon size={16} strokeWidth={2} />
                              {subLink.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Logout */}
          <div className="px-3 py-4 border-t border-slate-200/60">
            <button
              onClick={handleLogout}
              className="group flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold 
                   text-slate-700 hover:bg-red-50 hover:text-red-600 
                   rounded-xl transition-all duration-200 cursor-pointer"
            >
              <LogOut
                size={18}
                strokeWidth={2.5}
                className="transition-transform duration-200 group-hover:scale-110"
              />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
