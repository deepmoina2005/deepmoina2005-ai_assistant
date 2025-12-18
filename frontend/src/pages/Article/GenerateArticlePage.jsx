import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, Edit, Trash2, ChevronDown } from "lucide-react";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import MarkdownRenderer from "../../components/common/MarkdownRenderer";
import ArticleCard from "../../components/article/ArticleCard";
import articleService from "../../services/articleService";
import aiService from "../../services/aiService";

const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [inputTopic, setInputTopic] = useState("");
  const [articleLength, setArticleLength] = useState("medium");
  const [generating, setGenerating] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);

  // Fetch Articles
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await articleService.getArticles();
      setArticles(data || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Open view modal
  const openArticle = (article) => {
    setSelectedArticle(article);
    setViewModalOpen(true);
  };

  // Delete
  const handleDeleteRequest = (article) => {
    setArticleToDelete(article);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete?.id) return;
    setDeleting(true);
    try {
      await articleService.deleteArticle(articleToDelete.id);
      setArticles(articles.filter((a) => a.id !== articleToDelete.id));
      toast.success("Article deleted!");
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to delete article");
    } finally {
      setDeleting(false);
    }
  };

  // Generate Article
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!inputTopic.trim()) {
      toast.error("Enter a topic");
      return;
    }
    setGenerating(true);
    try {
      const res = await aiService.generateArticle(inputTopic, articleLength);
      const newArticle = {
        id: res.article_id || Date.now(),
        title: inputTopic,
        content: res.article,
        created_at: new Date(),
      };
      setArticles([newArticle, ...articles]);
      setSelectedArticle(newArticle);
      setViewModalOpen(true);
      setGenerateModalOpen(false);
      setInputTopic("");
      toast.success("Article generated!");
    } catch (err) {
      toast.error(err.message || "Failed to generate article");
    } finally {
      setGenerating(false);
    }
  };

  const renderContent = () => {
    if (loading)
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner />
        </div>
      );

    if (articles.length === 0)
      return (
        <div className="flex items-center justify-center min-h-[400px] text-center">
          <div className="max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-r from-slate-100 to-slate-200 shadow-lg shadow-slate-200/50 mb-6">
              <Edit className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-2">
              No Articles Yet
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Click "Generate Article" to create your first article.
            </p>
            <Button
              onClick={() => setGenerateModalOpen(true)}
              className="flex items-center gap-2 justify-center"
            >
              <Edit className="w-4 h-4" /> Generate Article
            </Button>
          </div>
        </div>
      );

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={openArticle}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">
            My Articles
          </h1>
          <p className="text-slate-500">
            Manage and organize your AI-generated articles
          </p>
        </div>
        <Button
          onClick={() => setGenerateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" /> Generate Article
        </Button>
      </div>

      {/* Articles */}
      {renderContent()}

      {/* View Modal */}
      {viewModalOpen && selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl p-8">
            <button
              onClick={() => setViewModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
            <h2 className="text-xl font-medium text-slate-900 tracking-tight mb-4">
              {selectedArticle.title}
            </h2>
            <div className="max-h-[70vh] overflow-y-auto prose prose-slate prose-sm max-w-none">
              <MarkdownRenderer content={selectedArticle.content} />
            </div>
          </div>
        </div>
      )}

      {/* Generate Modal */}
      {generateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl p-8">
            <button
              onClick={() => setGenerateModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
            <h2 className="text-xl font-medium text-slate-900 tracking-tight mb-2">
              Generate New Article
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Enter a topic and select length
            </p>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  value={inputTopic}
                  onChange={(e) => setInputTopic(e.target.value)}
                  placeholder="e.g. React Interview Prep"
                  className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg transition"
                />
              </div>
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Length
                </label>

                <div className="relative">
                  <select
                    value={articleLength}
                    onChange={(e) => setArticleLength(e.target.value)}
                    className="w-full h-12 pl-4 pr-10 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 text-sm
                 appearance-none focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg transition"
                  >
                    <option value="short">Short (500–800 words)</option>
                    <option value="medium">Medium (800–1200 words)</option>
                    <option value="long">Long (1200+ words)</option>
                  </select>

                  {/* Lucide icon */}
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGenerateModalOpen(false)}
                  disabled={generating}
                  className="flex-1 h-11 px-4 border border-slate-300 rounded-xl bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="flex-1 h-11 px-4 rounded-xl bg-linear-to-r from-emerald-400 to-teal-500 text-white text-sm font-semibold hover:opacity-90 flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </span>
                  ) : (
                    "Generate"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && articleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl p-8">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            <div className="mb-6 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-2">
                <Trash2 className="w-6 h-6 text-red-700" strokeWidth={2} />
              </div>
              <h2 className="text-xl font-medium text-slate-900 tracking-tight mb-2">
                Confirm Deletion
              </h2>
              <p className="text-sm text-slate-600 text-center">
                Are you sure you want to delete the article:{" "}
                <span className="font-semibold text-slate-900">
                  {articleToDelete.title}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 h-11 px-4 border border-slate-300 rounded-xl bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 h-11 px-4 rounded-xl bg-red-500 text-white text-sm font-semibold hover:opacity-90 flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleListPage;
