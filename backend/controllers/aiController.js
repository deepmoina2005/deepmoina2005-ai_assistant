import pool from "../config/db.js";
import * as geminiService from "../utils/geminiService.js";
import {
  generateImage as clipdropGenerateImage, removeBackground as clipdropRemoveBackground
} from "../utils/clipdropService.js";
import { v2 as cloudinary } from "cloudinary";

export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 10 } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "Please provide documentId",
        statusCode: 400,
      });
    }

    // Fetch document
    const [docRows] = await pool.query(
      "SELECT * FROM documents WHERE id = ? AND user_id = ? AND status = ?",
      [documentId, req.user.id, "ready"]
    );

    if (docRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Document not found or not ready",
        statusCode: 404,
      });
    }

    const document = docRows[0];

    // Generate flashcards using AI
    const cards = await geminiService.generateFlashcards(
      document.extracted_text,
      parseInt(count)
    );

    // Insert flashcard set
    const [result] = await pool.query(
      "INSERT INTO flashcards (user_id, document_id) VALUES (?, ?)",
      [req.user.id, document.id]
    );

    const flashcardSetId = result.insertId;

    // Insert flashcard items
    for (const card of cards) {
      await pool.query(
        `INSERT INTO flashcard_items 
         (flashcard_id, question, answer, difficulty, review_count, is_starred) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          flashcardSetId,
          card.question,
          card.answer,
          card.difficulty || "medium",
          0, // review_count
          0, // is_starred
        ]
      );
    }

    res.status(201).json({
      success: true,
      data: {
        id: flashcardSetId,
        documentId: document.id,
        userId: req.user.id,
        cards,
      },
      message: "Flashcard generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const generateQuiz = async (req, res, next) => {
  try {
    const { 
      documentId, 
      title: rootTitle, 
      numQuestions: rootNumQuestions,
      config = {}
    } = req.body;

    const finalNumQuestions = parseInt(config.numQuestions || rootNumQuestions || 5);
    const finalTitle = config.title || rootTitle;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "Please provide documentId",
        statusCode: 400,
      });
    }

    // 1️⃣ Find document
    const [docRows] = await pool.query(
      "SELECT * FROM documents WHERE id = ? AND user_id = ? AND status = ?",
      [documentId, req.user.id, "ready"]
    );

    if (docRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Document not found or not ready",
        statusCode: 404,
      });
    }

    const document = docRows[0];

    // 2️⃣ Generate quiz
    const questions = await geminiService.generateQuiz(
      document.extracted_text,
      finalNumQuestions
    );

    // 3️⃣ Insert quiz
    const [quizResult] = await pool.query(
      `INSERT INTO quizzes (user_id, document_id, title, score)
       VALUES (?, ?, ?, 0)`,
      [
        req.user.id,
        document.id,
        finalTitle || `${document.title} - Quiz`,
      ]
    );

    const quizId = quizResult.insertId;

    // 4️⃣ Insert quiz questions + options
    for (const q of questions) {
      // Insert question without options JSON
      const [qResult] = await pool.query(
        `INSERT INTO quiz_questions
         (quiz_id, question, explanation, difficulty, correct_answer)
         VALUES (?, ?, ?, ?, ?)`,
        [
          quizId,
          q.question,
          q.explanation || "",
          q.difficulty || "medium",
          q.correctAnswer || ""
        ]
      );

      const questionId = qResult.insertId;

      // 4 options ko quiz_options table me insert
      for (const opt of q.options || []) {
        const isCorrect = q.correctAnswer?.includes(opt) ? 1 : 0;

        await pool.query(
          `INSERT INTO quiz_options
           (question_id, option_text, is_correct)
           VALUES (?, ?, ?)`,
          [questionId, opt, isCorrect]
        );
      }
    }

    // 5️⃣ Response
    res.status(201).json({
      success: true,
      data: {
        quizId,
        documentId: document.id,
        title: finalTitle || `${document.title} - Quiz`,
        questions,
      },
      message: "Quiz generated successfully",
    });

  } catch (error) {
    next(error);
  }
};

export const generateSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "Please provide documentId",
        statusCode: 400,
      });
    }

    const [docRows] = await pool.query(
      "SELECT * FROM documents WHERE id = ? AND user_id = ? AND status = ?",
      [documentId, req.user.id, "ready"]
    );

    if (docRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Document not found or not ready",
        statusCode: 404,
      });
    }

    const document = docRows[0];

    const summary = await geminiService.generateSummary(
      document.extracted_text
    );

    res.status(200).json({
      success: true,
      data: {
        documentId: document.id,
        title: document.title,
        summary,
      },
      message: "Summary generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const explainConcept = async (req, res, next) => {
    try {
        const { documentId, concept } = req.body;

        if (!documentId || !concept) {
            return res.status(400).json({ success: false, error: "Missing parameters" });
        }

        // 1️⃣ Fetch document text
        const [docRows] = await pool.query(
            "SELECT extracted_text FROM documents WHERE id = ? AND user_id = ? AND status = ?",
            [documentId, req.user.id, "ready"]
        );

        if (!docRows.length) {
            return res.status(404).json({ success: false, error: "Document not found" });
        }

        const documentText = docRows[0].extracted_text;

        // 2️⃣ Call AI service to explain concept
        const explanation = await geminiService.explainConcept(documentText, concept);

        // 3️⃣ Return explanation
        res.status(200).json({ success: true, explanation });
    } catch (error) {
        next(error);
    }
};

export const generateArticle = async (req, res, next) => {
  try {
    const userId = req.user?.id; // make sure user is authenticated
    const { topic, length = "medium" } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        statusCode: 401,
      });
    }

    if (!topic || !topic.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please provide a topic",
        statusCode: 400,
      });
    }

    // Call Gemini AI service
    const article = await geminiService.generateArticle(topic, length);

    // Save to database
    await pool.query(
      "INSERT INTO creations (user_id, prompt, content, type) VALUES (?, ?, ?, ?)",
      [userId, topic, article, "article"]
    );

    res.status(200).json({
      success: true,
      data: {
        topic,
        article,
      },
      message: "Article generated and saved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const generateImage = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { prompt } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        statusCode: 401,
      });
    }

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please provide a prompt",
        statusCode: 400,
      });
    }

    // ------------------------------
    // CALL CLIPDROP IMAGE SERVICE
    // ------------------------------
    const base64 = await clipdropGenerateImage(prompt);
    const base64Image = `data:image/png;base64,${base64}`;

    // ------------------------------
    // UPLOAD TO CLOUDINARY
    // ------------------------------
    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    // ------------------------------
    // SAVE TO DATABASE (without publish column)
    // ------------------------------
    await pool.query(
      `INSERT INTO creations (user_id, prompt, content, type)
       VALUES (?, ?, ?, 'image')`,
      [userId, prompt, secure_url]
    );

    // ------------------------------
    // RESPONSE
    // ------------------------------
    res.status(200).json({
      success: true,
      data: {
        prompt,
        image: secure_url,
      },
      message: "Image generated and saved successfully",
    });
  } catch (error) {
    console.error("Generate Image Error:", error);
    next(error);
  }
};