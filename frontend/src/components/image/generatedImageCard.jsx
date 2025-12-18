import { Trash2, Download, Clock } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import toast from "react-hot-toast";

const GeneratedImageCard = ({ image, onDelete, onClick }) => {
  const [, setDownloaded] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(image);
  };

  const handleDownload = async (e) => {
  e.stopPropagation();
  try {
    const response = await fetch(image.url, { mode: 'cors' });
    if (!response.ok) throw new Error("Failed to fetch image");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `generated_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("Image downloaded!");
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  } catch (error) {
    console.error(error);
    toast.error("Failed to download image");
  }
};


  return (
    <div
      className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-3
        hover:border-slate-300/60 hover:shadow-xl hover:shadow-slate-200/50
        transition-all duration-300 flex flex-col justify-between cursor-pointer hover:translate-y-1"
      onClick={() => onClick(image)} // optional: open modal
    >
      {/* Image Preview */}
      <div className="w-full h-full mb-3 overflow-hidden rounded-lg">
        <img
          src={image.url}
          alt={image.prompt || "Generated Image"}
          className="w-full h-full object-cover"
        />
      </div>

       {/* Created Date */}
      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
        <Clock className="w-3.5 h-3.5" strokeWidth={2} />
        <span>Created {moment(image.created_at).fromNow()}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all duration-300"
          title="Download Image"
        >
          <Download className="w-4 h-4" strokeWidth={2} />
        </button>
        <button
          onClick={handleDelete}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
          title="Delete Image"
        >
          <Trash2 className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default GeneratedImageCard;
