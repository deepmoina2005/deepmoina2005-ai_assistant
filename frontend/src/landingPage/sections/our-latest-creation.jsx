/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "../components/section-title";

import image1 from "../../assets/image1.png";
import image2 from "../../assets/image2.png";
import image3 from "../../assets/image3.png";

export default function OurLatestCreation() {
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [className, setClassName] = useState("");

  const sectionData = [
    {
      title: "AI Study Assist",
      description:
        "Smart AI tools for generating notes, solving doubts, summarizing chapters, and learning faster with syllabus-aligned precision.",
      image:image1,
      align: "object-center",
    },
    {
      title: "Exam Practice & RAG Engine",
      description:
        "Practice mock tests, MCQs, and previous year questions powered by a Retrieval-Augmented (RAG) system trained on your exact syllabus.",
      image:image2,
      align: "object-right",
    },
    {
      title: "Creative & Career Tools",
      description:
        "Generate logos, resumes, portfolios, and creative content instantly with AI to boost your learning, projects, and career growth.",
      image:image3,
      align: "object-center",
    },
  ];

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sectionData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered, sectionData.length]);

  return (
    <section className="flex flex-col items-center" id="creations">
      <SectionTitle
        title="Our latest creation"
        description="A visual collection of our most recent works - each piece crafted with intention, emotion, and style."
      />

      <div
        className="flex items-center gap-4 h-100 w-full max-w-5xl mt-18 mx-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {sectionData.map((data, index) => (
          <motion.div
            key={data.title}
            className={`relative group grow h-[400px] rounded-xl overflow-hidden ${
              isHovered && className
                ? "hover:w-full w-56"
                : index === activeIndex
                ? "w-full"
                : "w-56"
            } ${className} ${!className ? "pointer-events-none" : ""}`}
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            onAnimationComplete={() =>
              setClassName("transition-all duration-500")
            }
            transition={{
              delay: `${index * 0.15}`,
              type: "spring",
              stiffness: 320,
              damping: 70,
              mass: 1,
            }}
          >
            <img
              className={`h-full w-full object-cover ${data.align}`}
              src={data.image}
              alt={data.title}
            />
            <div
              className={`absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 transition-all duration-300 ${
                isHovered && className
                  ? "opacity-0 group-hover:opacity-100"
                  : index === activeIndex
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            >
              <h1 className="text-3xl font-semibold">{data.title}</h1>
              <p className="text-sm mt-2">{data.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
