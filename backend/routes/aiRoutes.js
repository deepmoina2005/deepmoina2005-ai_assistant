import express from 'express'
import {
    explainConcept,
    generateArticle,
    generateBlogTitle,
    generateFlashcards,
    generateImage,
    generateQuiz,
    generateSummary,
    removeBackground,
    removeObject,
} from '../controllers/aiController.js'
import protect from '../middlware/auth.js'

const router = express.Router();

router.use(protect);

router.post('/generate-flashcards', generateFlashcards);
router.post('/generate-quiz', generateQuiz);
router.post('/generate-summary', generateSummary);
router.post('/explain-concept', explainConcept)
router.post('/generate-article', generateArticle);
router.post('/generate-blog-title', generateBlogTitle);
router.post('/generate-image', generateImage);
router.post('/remove-background', removeBackground);
router.post('/remove-object', removeObject);

export default router;