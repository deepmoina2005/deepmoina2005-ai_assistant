import express from 'express'
import {
    getFlashcards,
    getAllFlashcardSets,
    reviewFlashCard,
    toggleStarFlashcard,
    deleteFlashcardSet
} from '../controllers/flashcardController.js'
import protect from '../middlware/auth.js'

const router = express.Router();

router.use(protect);

router.get('/', getAllFlashcardSets);
router.get('/:documentId', getFlashcards);
router.post('/:cardId/review', reviewFlashCard);
router.put('/:cardId/star', toggleStarFlashcard);
router.delete('/:id', deleteFlashcardSet);

export default router;