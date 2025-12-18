import { useEffect, useState } from 'react'
import flashcardService from '../../services/flashcardService'
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import FlashcardSetCard from "../../components/flashcards/FlashcardSetCard";
import PageHeader from "../../components/common/PageHeader";

const FlashcardsListPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchFlashcardSets = async () => {
    try {
      const data = await flashcardService.getAllFlashcardSets();

      console.log("fetchFlashcardSets__", data);

      setFlashcardSets(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch flashcard sets.");
    } finally {
      setLoading(false);
    }
  };
  fetchFlashcardSets();
}, []);


  const renderContent = () => {
    if (loading) return <Spinner />;

    if (!Array.isArray(flashcardSets) || flashcardSets.length === 0) {
      return (
        <EmptyState
          title="No Flashcard Sets Found"
          description="You haven't generated any flashcards yet. Go to a document to create your first Set."
        />
      );
    }

    return (
  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
    {flashcardSets.map((set, index) => (
      <FlashcardSetCard
        key={set._id || set.id || index}
        flashcardSet={set}
      />
    ))}
  </div>
);

  };

  return (
    <div>
      <PageHeader title="All Flashcard Sets" />
      {renderContent()}
    </div>
  );
};

export default FlashcardsListPage;
