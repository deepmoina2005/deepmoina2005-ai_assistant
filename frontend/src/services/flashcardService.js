import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

const getAllFlashcardSets = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_FLASHCARD_SETS);
        return response.data?.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch flashcards sets'}
    }
}

const getFlashcardsForDocument = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(documentId));

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch flashcards'}
    }
}

const reviewFlashcard = async (cardId, cardIndex) => {
  if (!cardId) {
    console.error("❌ reviewFlashcard called with undefined cardId");
    throw { message: "Flashcard ID missing" };
  }

  try {
    const response = await axiosInstance.post(
      API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId),
      { cardIndex }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to review flashcard" };
  }
};


const toggleStar = async (cardId) => {
  if (!cardId) {
    console.error("❌ toggleStar called with undefined cardId");
    throw { message: "Flashcard ID missing" };
  }

  try {
    const response = await axiosInstance.put(
      API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to star flashcard" };
  }
};


const deleteFlashcardSet = async (id) => {
  if (!id) {
    throw { message: "Flashcard set ID is undefined" };
  }
  try {
    const response = await axiosInstance.delete(
      API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete flashcard" };
  }
};


const flashcardService = {
  getAllFlashcardSets,
  getFlashcardsForDocument,
  reviewFlashcard,
  toggleStar,
  deleteFlashcardSet
}

export default flashcardService;