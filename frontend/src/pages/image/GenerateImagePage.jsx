import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, Trash2, Download } from "lucide-react";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import GenerateImageCard from "../../components/image/generatedImageCard";
import aiService from "../../services/aiService";
import imageService from "../../services/imageService";

const GenerateImagePage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [inputPrompt, setInputPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  // Fetch all images from backend
  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await imageService.getImages();
      setImages(data || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const openImage = (image) => {
    setSelectedImage(image);
    setViewModalOpen(true);
  };

  const handleDeleteRequest = (image) => {
    setImageToDelete(image);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!imageToDelete?.id) return;
    setDeleting(true);
    try {
      await imageService.deleteImage(imageToDelete.id);
      setImages(images.filter((i) => i.id !== imageToDelete.id));
      toast.success("Image deleted!");
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to delete image");
    } finally {
      setDeleting(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!inputPrompt.trim()) {
      toast.error("Enter a prompt");
      return;
    }
    setGenerating(true);
    try {
      const res = await aiService.generateImage(inputPrompt);
      const newImage = {
        id: res.id, // Make sure backend returns unique ID
        prompt: inputPrompt,
        url: res.image,
      };
      setImages([newImage, ...images]);
      setSelectedImage(newImage);
      setViewModalOpen(true);
      setGenerateModalOpen(false);
      setInputPrompt("");
      toast.success("Image generated!");
    } catch (err) {
      toast.error(err.message || "Failed to generate image");
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

    if (images.length === 0)
      return (
        <div className="flex items-center justify-center min-h-[400px] text-center">
          <div className="max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-r from-slate-100 to-slate-200 shadow-lg shadow-slate-200/50 mb-6">
              <Download className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-2">
              No Images Yet
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Click "Generate Image" to create your first AI image.
            </p>
            <Button onClick={() => setGenerateModalOpen(true)} className="flex items-center gap-2 justify-center">
              <Download className="w-4 h-4" /> Generate Image
            </Button>
          </div>
        </div>
      );

   return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {images.map((image, index) => (
      <GenerateImageCard
        key={image.id || image.url || index}
        image={image}
        onClick={openImage}
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
            My Generated Images
          </h1>
          <p className="text-slate-500">Manage and view your AI-generated images</p>
        </div>
        <Button onClick={() => setGenerateModalOpen(true)} className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Generate Image
        </Button>
      </div>

      {/* Images */}
      {renderContent()}

      {/* View Modal */}
      {viewModalOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl p-8">
            <button
              onClick={() => setViewModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
            <div className="max-h-[70vh] overflow-y-auto flex justify-center">
              <img src={selectedImage.url} alt={selectedImage.prompt} className="max-h-[70vh] rounded-lg" />
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
              Generate New Image
            </h2>
            <p className="text-sm text-slate-500 mb-4">Enter a prompt to generate an AI image</p>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Prompt</label>
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="e.g. Futuristic city skyline at sunset"
                  className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg transition"
                />
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
      {isDeleteModalOpen && imageToDelete && (
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
              <h2 className="text-xl font-medium text-slate-900 tracking-tight mb-2">Confirm Deletion</h2>
              <p className="text-sm text-slate-600 text-center">
                Are you sure you want to delete this image? This action cannot be undone.
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

export default GenerateImagePage;
