/* eslint-disable no-unused-vars */
import { useState } from "react";
import { BrainCircuit, MenuIcon, XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const navlinks = [
        { href: "#creations", text: "Creations" },
        { href: "#about", text: "About" },
         { href: "#community", text: "Community" },
        { href: "#contact", text: "Contact" },
    ];

    return (
        <>
            <motion.nav
                className="sticky top-0 z-50 flex items-center justify-between w-full h-18 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <Link to="/">
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
                </Link>

                <div className="hidden lg:flex items-center ml-30 gap-8 transition duration-500">
                    {navlinks.map((link) => (
                        <Link key={link.href} to={link.href} className="hover:text-emerald-500 hover:border-b-2 hover:border-emerald-500 transition">
                            {link.text}
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:block space-x-3">
                    <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 transition text-white rounded-md active:scale-95">
                        Get started
                    </button>

                    {/* Login Button navigates to /login */}
                    <button
                        onClick={() => navigate("/login")}
                        className="hover:bg-slate-300/20 transition px-6 py-2 border border-slate-400 rounded-md active:scale-95"
                    >
                        Login
                    </button>
                </div>

                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="lg:hidden active:scale-90 transition"
                >
                    <MenuIcon className="size-6.5" />
                </button>
            </motion.nav>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 z-100 bg-black/60 backdrop-blur flex flex-col items-center justify-center text-lg text-neutral-200 gap-8 lg:hidden transition-transform duration-400 ${
                    isMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {navlinks.map((link) => (
                    <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)}>
                        {link.text}
                    </Link>
                ))}

                <button
                    onClick={() => setIsMenuOpen(false)}
                    className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex"
                >
                    <XIcon />
                </button>
            </div>
        </>
    );
}
