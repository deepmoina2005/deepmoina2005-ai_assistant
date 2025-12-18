import { useState, useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  Clock,
  Image as ImageIcon,
  FileText as ArticleIcon,
} from "lucide-react";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await progressService.getDashboardData();
        console.log("Data__getDashboardData", res);
        setDashboardData(res);
      } catch (error) {
        toast.error("Failed to fetch dashboard data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <Spinner />;

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-200 mb-4 shadow">
            <TrendingUp className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-600 text-sm">No dashboard data available.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Documents",
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
      gradient: "from-blue-400 to-cyan-500",
      shadowColor: "shadow-blue-500/25",
    },
    {
      label: "Total Flashcards",
      value: dashboardData.overview.totalFlashcards,
      icon: BookOpen,
      gradient: "from-purple-400 to-cyan-500",
      shadowColor: "shadow-purple-500/25",
    },
    {
      label: "Total Quizzes",
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
      gradient: "from-emerald-400 to-cyan-500",
      shadowColor: "shadow-emerald-500/25",
    },
    {
      label: "Total AI Images",
      value: dashboardData.overview.totalGeneratedImages || 0,
      icon: ImageIcon,
      gradient: "from-pink-400 to-purple-500",
      shadowColor: "shadow-pink-500/25",
    },
    {
      label: "Total AI Articles",
      value: dashboardData.overview.totalGeneratedArticles || 0,
      icon: ArticleIcon,
      gradient: "from-yellow-400 to-orange-500",
      shadowColor: "shadow-yellow-500/25",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[16px_16px] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm">
            Track your learning progress and activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold text-xs uppercase tracking-wide">
                    {stat.label}
                  </span>
                  <div
                    className={`w-11 h-11 rounded-xl bg-linear-to-br ${stat.gradient} shadow-md ${stat.shadowColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                </div>
                <div className="text-3xl font-semibold text-slate-900 tracking-tight">
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-600" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
              Recent Activity
            </h3>
          </div>

          {dashboardData.recentActivity &&
          ((dashboardData.recentActivity.documents?.length || 0) > 0 ||
            (dashboardData.recentActivity.quizzes?.length || 0) > 0 ||
            (dashboardData.recentActivity.images?.length || 0) > 0 ||
            (dashboardData.recentActivity.articles?.length || 0) > 0) ? (
            <div className="space-y-3">
              {[
                ...(dashboardData.recentActivity.documents || []).map((doc) => ({
                  id: doc.id || doc._id,
                  description: doc.title,
                  timestamp: doc.lastAccessed,
                  link: `/documents/${doc.id || doc._id}`,
                  type: "document",
                })),
                ...(dashboardData.recentActivity.quizzes || []).map((quiz) => ({
                  id: quiz.id || quiz._id,
                  description: quiz.title,
                  timestamp: quiz.completedAt,
                  link: `/quizzes/${quiz.id || quiz._id}`,
                  type: "quiz",
                })),
                ...(dashboardData.recentActivity.images || []).map((img) => ({
                  id: img.id || img._id,
                  description: img.prompt,
                  timestamp: img.createdAt,
                  link: img.url,
                  type: "image",
                })),
                ...(dashboardData.recentActivity.articles || []).map((art) => ({
                  id: art.id || art._id,
                  description: art.prompt,
                  timestamp: art.createdAt,
                  link: `/articles/${art.id || art._id}`,
                  type: "article",
                })),
              ]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((activity, index) => (
                  <div
                    key={activity.id || index}
                    className="group flex items-center justify-between p-4 bg-slate-50/50 border border-slate-200/60 hover:bg-white hover:border-slate-300/60 hover:shadow-md transition-all duration-200 rounded-2xl"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.type === "document"
                              ? "bg-linear-to-r from-blue-400 to-cyan-500"
                              : activity.type === "quiz"
                              ? "bg-linear-to-r from-emerald-400 to-teal-500"
                              : activity.type === "image"
                              ? "bg-linear-to-r from-pink-400 to-purple-500"
                              : "bg-linear-to-r from-yellow-400 to-orange-500"
                          }`}
                        />
                        <p className="text-sm text-slate-900 font-medium truncate">
                          <span className="text-slate-700">
                            {activity.type === "document"
                              ? "Accessed Document: "
                              : activity.type === "quiz"
                              ? "Attempted Quiz: "
                              : activity.type === "image"
                              ? "Generated Image: "
                              : "Generated Article: "}
                          </span>
                          {activity.description}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 pl-4">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>

                    {activity.link && (
                      <a
                        href={activity.link}
                        target={["image", "article"].includes(activity.type) ? "_blank" : "_self"}
                        rel="noreferrer"
                        className="m-4 px-4 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-200 whitespace-nowrap"
                      >
                        View
                      </a>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 text-sm">No recent activity yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
