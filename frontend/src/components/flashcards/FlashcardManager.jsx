/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import flashcardService from "../../services/flashcardService";
import toast from "react-hot-toast";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import {
  Brain,
  Plus,
  Sparkles,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import moment from "moment";
import Modal from "../common/Modal";
import Flashcard from "./Flashcard";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardsForDocument(
        documentId
      );
      setFlashcardSets(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch flashcard sets.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcardSets();
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully");
      fetchFlashcardSets();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  // ------------------------
  // REVIEW FLASHCARD FIXED
  // ------------------------
  const handleReview = async () => {
    if (!selectedSet || !selectedSet.cards?.length) return;

    const currentCard = selectedSet.cards[currentCardIndex];
    const cardId = currentCard.id || currentCard._id;
    if (!cardId) {
      console.warn("Flashcard ID missing at index", currentCardIndex);
      return;
    }

    try {
      await flashcardService.reviewFlashcard(cardId); // only cardId
      // Update frontend state
      const updatedCards = [...selectedSet.cards];
      updatedCards[currentCardIndex] = {
        ...updatedCards[currentCardIndex],
        reviewCount: (updatedCards[currentCardIndex].reviewCount || 0) + 1,
        lastReviewed: new Date().toISOString(),
      };
      setSelectedSet({
        ...selectedSet,
        cards: updatedCards,
      });

      toast.success("Flashcard reviewed successfully");
    } catch (error) {
      console.error("Failed to review flashcard", error);
      toast.error(error.message || "Failed to review flashcard");
    }
  };

  const handleNextCard = () => {
    if (!selectedSet) return;
    handleReview(); // review current card

    setCurrentCardIndex((prev) => (prev + 1) % selectedSet.cards.length);
  };

  const handlePrevCard = () => {
    if (!selectedSet) return;
    handleReview();

    setCurrentCardIndex(
      (prev) => (prev - 1 + selectedSet.cards.length) % selectedSet.cards.length
    );
  };

  // ------------------------
  // STAR TOGGLE FIXED
  // ------------------------
const handleToggleStar = async (cardId) => {
  if (!cardId) {
    console.warn("toggleStar called with undefined cardId");
    return;
  }

  try {
    const response = await flashcardService.toggleStar(cardId);

    setSelectedSet((prev) => ({
      ...prev,
      cards: prev.cards.map((card) =>
        card.id === cardId
          ? { ...card, is_starred: response.data.isStarred }
          : card
      ),
    }));
  } catch (error) {
    toast.error(error.message || "Failed to update star.");
  }
};


  // ------------------------
  // DELETE SET
  // ------------------------
  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();

    const flashcardSetId = set?.flashcardSetId; // <-- correct field

    if (!flashcardSetId) {
      console.warn("Cannot delete: Flashcard set ID is missing", set);
      return;
    }

    setSetToDelete({ ...set, id: flashcardSetId });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const flashcardSetId = setToDelete?.id;

    if (!flashcardSetId) {
      toast.error("Flashcard set ID missing");
      return;
    }

    setDeleting(true);

    try {
      await flashcardService.deleteFlashcardSet(flashcardSetId);
      toast.success("Flashcard set deleted");
      setIsDeleteModalOpen(false);
      setSetToDelete(null);
      fetchFlashcardSets();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectedSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  // ------------------------
  // RENDER VIEWER
  // ------------------------
  const renderFlashcardViewer = () => {
    const currentCard = selectedSet.cards[currentCardIndex];

    return (
      <div className="space-y-8">
        <button
          onClick={() => setSelectedSet(null)}
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Sets
        </button>

        <div className="flex flex-col items-center space-y-8">
          <div className="w-full max-w-2xl">
            <Flashcard
              flashcard={currentCard}
              onToggleStar={handleToggleStar}
              onReview={handleReview} // just pass handleReview
            />
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={handlePrevCard}
              className="group flex items-center gap-2 px-5 h-11 bg-slate-100 text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-200 transition-all"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Previous
            </button>

            <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-sm font-semibold text-slate-700">
                {currentCardIndex + 1}{" "}
                <span className="text-slate-400 font-normal">/</span>{" "}
                {selectedSet.cards.length}
              </span>
            </div>

            <button
              onClick={handleNextCard}
              className="group flex items-center gap-2 px-5 h-11 bg-slate-100 text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-200 transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ------------------------
  // RENDER SET LIST
  // ------------------------
  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-10">
          <Spinner />
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 mb-6">
            <Brain className="w-8 h-8 text-emerald-600" />
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No Flashcards Yet
          </h3>

          <p className="text-sm text-slate-500 mb-8 text-center max-w-sm">
            Generate flashcards from your document to begin learning.
          </p>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="group inline-flex items-center gap-2 px-6 h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Flashcards
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Your Flashcard Sets
            </h3>
            <p className="text-sm text-slate-500">
              {flashcardSets.length} sets available
            </p>
          </div>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="group inline-flex items-center gap-2 px-5 h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Generate New Set
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcardSets.map((set, index) => (
            <div
              key={set._id || index}
              onClick={() => handleSelectedSet(set)}
              className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-300 cursor-pointer transition-all hover:shadow-lg"
            >
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100">
                  <Brain className="w-6 h-6 text-emerald-700" />
                </div>

                <div>
                  <h4 className="text-base font-semibold text-slate-900">
                    Flashcard Set
                  </h4>
                  <p className="text-xs text-slate-500">
                    Created {moment(set.createdAt).format("MMM D, YYYY")}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded">
                    <span className="text-sm font-semibold text-emerald-700">
                      {set.cards.length} cards
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8">
        {selectedSet ? renderFlashcardViewer() : renderSetList()}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set?"
      >
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this flashcard set? This action
            cannot be undone.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="h-11 px-5 border border-slate-300 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="h-11 px-4 rounded-xl bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition flex items-center gap-2"
            >
              {deleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FlashcardManager;
