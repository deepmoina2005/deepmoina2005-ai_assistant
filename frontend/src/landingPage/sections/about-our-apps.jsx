/* eslint-disable no-unused-vars */
import SectionTitle from "../components/section-title";
import { motion } from "framer-motion";

// Lucide Icons
import {
    Cpu,
    NotebookPen,
    Rocket,
    ScanText,
    GraduationCap,
    BookCopy,
    LayoutDashboard,
    PenTool,
} from "lucide-react";

export default function AboutOurApps() {
    const sectionData = [
        {
            title: "AI-Powered Learning",
            description:
                "Generate notes, summaries, explanations, and concept breakdowns personalized for your learning style.",
            icon: Cpu,
            iconColor: "text-green-600",
        },
        {
            title: "Exam Practice & RAG Engine",
            description:
                "Attempt smart MCQs, mock tests, and previous year questions powered by a syllabus-trained RAG engine.",
            icon: NotebookPen,
            iconColor: "text-blue-600",
        },
        {
            title: "Creative & Career Tools",
            description:
                "Build resumes, generate logos, create content, and explore powerful creative tools.",
            icon: Rocket,
            iconColor: "text-purple-600",
        },
        {
            title: "Smart Text Scanner",
            description:
                "Scan text, extract notes instantly, and convert handwritten content to digital format.",
            icon: ScanText,
            iconColor: "text-rose-600",
        },
        {
            title: "Syllabus-Aligned Notes",
            description:
                "Access subject-wise curated notes aligned with your board, exam, and syllabus.",
            icon: BookCopy,
            iconColor: "text-yellow-600",
        },
        {
            title: "Career Guidance",
            description:
                "Get AI-powered career insights, course suggestions, and growth roadmap.",
            icon: GraduationCap,
            iconColor: "text-orange-600",
        },
        {
            title: "Study Dashboard",
            description:
                "Track progress, analyze weak areas, and get smart recommendations based on your performance.",
            icon: LayoutDashboard,
            iconColor: "text-cyan-600",
        },
        {
            title: "AI Writing Tools",
            description:
                "Generate assignments, essays, emails, applications, and project write-ups instantly.",
            icon: PenTool,
            iconColor: "text-teal-600",
        },
    ];

    return (
        <section className="flex flex-col items-center" id="about">
            <SectionTitle
                title="About our apps"
                description="Everything you need—from smart learning tools to creative and career boosters—powered by AI."
            />

            <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-8 md:px-0 mt-16 gap-6">
                {sectionData.map((data, index) => {
                    const Icon = data.icon;
                    return (
                        <motion.div
                            key={data.title}
                            className="border border-neutral-100 bg-white shadow-sm rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * 0.12,
                                type: "spring",
                                stiffness: 250,
                                damping: 30,
                            }}
                        >
                            {/* ICON WITH UNIQUE COLOR */}
                            <div className="w-12 h-12 p-2 bg-green-100 border border-green-300 rounded-full flex items-center justify-center">
                                <Icon className={`w-6 h-6 ${data.iconColor}`} />
                            </div>

                            <div className="mt-5 space-y-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {data.title}
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {data.description}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
