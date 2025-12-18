import express from 'express'
import protect from '../middlware/auth.js'
import { deleteImage, getAllImages, getImageById } from '../controllers/imageController.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllImages);
router.get('/:articleId', getImageById);
router.delete('/:id', deleteImage);

export default router;