import { Trash2, Clock, Copy } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import MarkdownRenderer from "../../components/common/MarkdownRenderer";
import toast from "react-hot-toast";

const ArticleCard = ({ article, onDelete, onClick }) => {
  const [, setCopied] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(article);
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(article.content || "")
      .then(() => {
        toast.success("Article copied to clipboard!");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => toast.error("Failed to copy"));
  };

  return (
    <div
      className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-5 
      hover:border-slate-300/60 hover:shadow-xl hover:shadow-slate-200/50 
      transition-all duration-300 flex flex-col justify-between cursor-pointer hover:translate-y-1"
      onClick={() => onClick(article)} // open view modal
    >
      {/* Title & Actions */}
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-base font-semibold text-slate-900 truncate"
          title={article.title}
        >
          {article.title}
        </h3>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={handleCopy}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-300"
            title="Copy Article"
          >
            <Copy className="w-4 h-4" strokeWidth={2} />
          </button>
          <button
            onClick={handleDelete}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
            title="Delete Article"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Markdown Content (3 lines preview) */}
      <div className="text-sm text-slate-500 line-clamp-3 mb-3">
        <MarkdownRenderer content={article.content || "No content available"} />
      </div>

      {/* Created Date */}
      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
        <Clock className="w-3.5 h-3.5" strokeWidth={2} />
        <span>Created {moment(article.created_at).fromNow()}</span>
      </div>
    </div>
  );
};

export default ArticleCard;
