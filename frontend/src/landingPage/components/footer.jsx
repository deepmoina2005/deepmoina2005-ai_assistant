/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { BrainCircuit, Instagram, Linkedin, Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      className="relative bg-slate-900 text-slate-400 mt-32 px-6 md:px-16 lg:px-24 xl:px-32 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      {/* Background decorative circle */}
      <motion.div
        className="absolute -z-10 w-64 h-64 rounded-full bg-green-500/10 top-0 right-0"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2 }}
      ></motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
        {/* Logo & Description */}
        <div className="sm:col-span-2 lg:col-span-1">
          <a href="#">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md shadow-emerald-500/30">
                <BrainCircuit className="text-white" size={24} strokeWidth={2.5} />
              </div>
              <h1 className="text-xl font-semibold text-white">Creona.AI</h1>
            </div>
          </a>
          <p className="text-base mt-3 text-slate-300 max-w-md">
            A modern web platform for learning, image editing, and AI-powered productivity,
            designed to make tasks faster, smarter, and visually appealing.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3 mt-4">
            {[{icon: Instagram, link: "https://instagram.com"},
              {icon: Linkedin, link: "https://linkedin.com"},
              {icon: Github, link: "https://github.com"},
              {icon: Twitter, link: "https://twitter.com"}].map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-800 hover:bg-green-500 transition-colors"
              >
                <item.icon size={18} className="text-white" />
              </a>
            ))}
          </div>
        </div>

        {/* Company Links */}
        <div className="flex flex-col mt-4 lg:mt-0">
          <h2 className="font-semibold mb-3 text-green-400 text-lg">Company</h2>
          <div className="flex flex-col space-y-1.5">
            <a className="hover:text-green-300 transition-colors duration-200" href="#">About us</a>
            <a className="hover:text-green-300 transition-colors duration-200" href="#">Contact us</a>
            <a className="hover:text-green-300 transition-colors duration-200" href="#">Privacy policy</a>
          </div>
        </div>

        {/* Resources Section */}
        <div className="flex flex-col mt-4 lg:mt-0">
          <h2 className="font-semibold mb-3 text-green-400 text-lg">Resources</h2>
          <div className="flex flex-col space-y-1.5">
            <a className="hover:text-green-300 transition-colors duration-200" href="#">Blog</a>
            <a className="hover:text-green-300 transition-colors duration-200" href="#">Tutorials</a>
            <a className="hover:text-green-300 transition-colors duration-200" href="#">AI Tools</a>
            <a className="hover:text-green-300 transition-colors duration-200" href="#">Support</a>
          </div>
        </div>

        {/* Developer Info */}
        <div className="bg-slate-800 text-white p-4 rounded-xl shadow-lg mt-4 lg:mt-0">
          <h2 className="font-semibold text-lg mb-3 text-green-400">Developer Info</h2>
          <div className="text-sm space-y-2">
            <p><span className="font-medium">Name:</span> Deepmoina Boruah</p>
            <p><span className="font-medium">Course:</span> BCA</p>
            <p><span className="font-medium">Semester:</span> 5th Semester</p>
            <p><span className="font-medium">Email:</span> deepmoina@example.com</p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="py-4 text-center border-t mt-6 border-slate-700 text-slate-500">
        Copyright 2025 ©{" "}
        <a className="hover:text-green-400 transition-colors duration-200" href="#">
          Creona.AI
        </a>{" "}
        All Rights Reserved.
      </p>
    </motion.footer>
  );
}
