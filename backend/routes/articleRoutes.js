import express from 'express'
import protect from '../middlware/auth.js'
import { deleteArticle, getAllArticles, getArticleById } from '../controllers/articleController.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllArticles);
router.get('/:articleId', getArticleById);
router.delete('/:id', deleteArticle);

export default router;