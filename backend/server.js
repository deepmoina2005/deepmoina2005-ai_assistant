import "dotenv/config"

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middlware/errorHandler.js'

import authRoutes from './routes/authRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import flashcardRoutes from './routes/flashcardRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import progressRoutes from './routes/progressRoutes.js'
import articleRoutes from './routes/articleRoutes.js'
import connectCloudinary from "./config/cloudinary.js";
import imageRoutes from "./routes/imageRoutes.js"
// ES6 module __dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();

await connectCloudinary();

// Middlware to handle CORS
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
)

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Sever running in ${process.env.NODE_ENV} node on port ${PORT}`);
})

process.on('unhandledRejection', (err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
})

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/images', imageRoutes);
app.use(errorHandler);


// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        statusCode: 404
    })
})