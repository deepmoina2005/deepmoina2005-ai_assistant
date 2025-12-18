/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Flashcard from "../../components/flashcards/Flashcard";
import Button from "../../components/common/Button";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Modal from "../../components/common/Modal";

const Flashcardpage = () => {
  const { id: documentId } = useParams();

  const [flashcardSets, setFlashcardSets] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ---------------------------------------------------------
  // Fetch Flashcards
  // ---------------------------------------------------------
  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardsForDocument(documentId);
      const set = response.data[0];

      setFlashcardSets(set);
      setFlashcards(set?.cards || []);
    } catch (error) {
      toast.error("Failed to fetch flashcards.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [documentId]);

  // ---------------------------------------------------------
  // Generate Flashcards
  // ---------------------------------------------------------
  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully!");
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  // ---------------------------------------------------------
  // Navigation + Review
  // ---------------------------------------------------------
  const handleReview = async () => {
    const currentCard = flashcards[currentCardIndex];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard.id);
      toast.success("Flashcard reviewed!");
    } catch (error) {
      toast.error(error.message || "Review failed.");
    }
  };

  const handleNextCard = () => {
    handleReview();
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    handleReview();
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  // ---------------------------------------------------------
  // Toggle Star
  // ---------------------------------------------------------
  const handleToggleStar = async (cardId) => {
    if (!cardId) {
      console.warn("toggleStar called with undefined cardId");
      return;
    }

    try {
      await flashcardService.toggleStar(cardId);

      setFlashcards((prev) =>
        prev.map((card) =>
          card.id === cardId ? { ...card, isStarred: !card.isStarred } : card
        )
      );

      toast.success("Star updated");
    } catch (error) {
      toast.error(error.message || "Failed to update star.");
    }
  };

  // Delete Flashcard Set
const handleDeleteFlashcardSet = async () => {
  setDeleting(true);

  try {
    // correct ID field (backend returns flashcardSetId)
    const flashcardSetId =
      flashcardSets?.flashcardSetId || flashcardSets?.id || flashcardSets?._id;

    if (!flashcardSetId) {
      toast.error("Flashcard set ID missing");
      setDeleting(false);
      return;
    }

    await flashcardService.deleteFlashcardSet(flashcardSetId);

    toast.success("Flashcard set deleted!");

    setIsDeleteModalOpen(false);
    fetchFlashcards();
  } catch (error) {
    toast.error(error?.message || "Failed to delete flashcard set");
  } finally {
    setDeleting(false);
  }
};


  // ---------------------------------------------------------
  // Render Flashcards
  // ---------------------------------------------------------
  const renderFlashcardContent = () => {
    if (loading) return <Spinner />;

    if (flashcards.length === 0)
      return (
        <EmptyState
          title="No Flashcards Yet"
          description="Generate flashcards from your document."
        />
      );

    const currentCard = flashcards[currentCardIndex];

    return (
      <div className="flex flex-col items-center space-y-6">
        <div className="w-full max-w-md">
          <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handlePrevCard}
            variant="secondary"
            disabled={flashcards.length <= 1}
          >
            <ChevronLeft size={16} /> Previous
          </Button>

          <span className="text-sm text-neutral-600">
            {currentCardIndex + 1} / {flashcards.length}
          </span>

          <Button
            onClick={handleNextCard}
            variant="secondary"
            disabled={flashcards.length <= 1}
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-4">
        <Link
          to={`/documents/${documentId}`}
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft size={16} /> Back to Document
        </Link>
      </div>

      <PageHeader title="Flashcards">
        <div className="flex gap-2">
          {!loading &&
            (flashcards.length > 0 ? (
              <Button onClick={() => setIsDeleteModalOpen(true)} disabled={deleting}>
                <Trash2 size={16} /> Delete Set
              </Button>
            ) : (
              <Button onClick={handleGenerateFlashcards} disabled={generating}>
                {generating ? <Spinner /> : <><Plus size={16} /> Generate Flashcards</>}
              </Button>
            ))}
        </div>
      </PageHeader>

      {renderFlashcardContent()}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Flashcard Set"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Are you sure you want to delete all flashcards? This cannot be undone.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>

            <Button
              onClick={handleDeleteFlashcardSet}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Flashcardpage;
