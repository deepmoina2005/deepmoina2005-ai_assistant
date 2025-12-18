import express from 'express';
import {
    getDashboard
} from '../controllers/progressController.js';
import protect from '../middlware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboard);

export default router