/* eslint-disable no-unused-vars */
import { ArrowRight, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <section className="flex flex-col items-center relative overflow-hidden py-24">
      {/* Background Circle */}
      <motion.div
        className="absolute -z-10"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 0.15, scale: 8 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <Circle className="text-green-400" />
      </motion.div>

      {/* Top Badge */}
      <motion.a
        className="flex items-center mt-12 gap-2 border border-green-600 text-green-800 rounded-full px-4 py-2 bg-green-50"
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 320,
          damping: 70,
          mass: 1,
        }}
      >
        <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
        <span>100+ AI Free Tools</span>
      </motion.a>

      {/* Heading */}
      <motion.h1
        className="text-center text-5xl leading-[68px] md:text-6xl md:leading-[70px] mt-8 font-semibold max-w-2xl text-gray-900"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          type: "spring",
          stiffness: 240,
          damping: 70,
          mass: 1,
        }}
      >
        Let's build AI agents together
      </motion.h1>

      {/* Paragraph */}
      <motion.p
        className="text-center text-base max-w-lg mt-4 text-gray-700"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 320,
          damping: 70,
          mass: 1,
        }}
      >
        Our platform helps you build, test, and deliver faster — so you can focus on what matters.
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="flex flex-col md:flex-row items-center gap-4 mt-8"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 70,
          mass: 1,
        }}
      >
        <button
          onClick={handleGetStarted}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition text-white active:scale-95 rounded-lg px-7 py-3"
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </button>

        <button className="border border-green-600 text-green-700 active:scale-95 hover:bg-green-50 transition rounded-lg px-8 py-3">
          Learn More
        </button>
      </motion.div>
    </section>
  );
}
