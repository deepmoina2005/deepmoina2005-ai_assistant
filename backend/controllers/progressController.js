import pool from '../config/db.js'; // MySQL pool

// @desc Get user learning statistics
// @route GET /api/progress/dashboard
// @access Private
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // --------------------------
    // 1. Get counts
    // --------------------------
    const [[{ totalDocuments }]] = await pool.query(
      'SELECT COUNT(*) AS totalDocuments FROM documents WHERE user_id = ?',
      [userId]
    );

    const [[{ totalFlashcardSets }]] = await pool.query(
      'SELECT COUNT(*) AS totalFlashcardSets FROM flashcards WHERE user_id = ?',
      [userId]
    );

    const [[{ totalQuizzes }]] = await pool.query(
      'SELECT COUNT(*) AS totalQuizzes FROM quizzes WHERE user_id = ?',
      [userId]
    );

    const [[{ completedQuizzes }]] = await pool.query(
      'SELECT COUNT(*) AS completedQuizzes FROM quizzes WHERE user_id = ? AND completed_at IS NOT NULL',
      [userId]
    );

    // --------------------------
    // 2. Flashcard statistics
    // --------------------------
    const [flashcardSets] = await pool.query(
      `SELECT f.id AS flashcard_set_id
       FROM flashcards f
       WHERE f.user_id = ?`,
      [userId]
    );

    let totalFlashcards = 0;
    let reviewFlashcards = 0;
    let starredFlashcards = 0;

    for (const set of flashcardSets) {
      const [cards] = await pool.query(
        `SELECT id, review_count, is_starred
         FROM flashcard_items
         WHERE flashcard_id = ?`,
        [set.flashcard_set_id]
      );
      totalFlashcards += cards.length;
      reviewFlashcards += cards.filter(c => c.review_count > 0).length;
      starredFlashcards += cards.filter(c => c.is_starred).length;
    }

    // --------------------------
    // 3. Quiz statistics
    // --------------------------
    const [quizzes] = await pool.query(
      'SELECT score FROM quizzes WHERE user_id = ? AND completed_at IS NOT NULL',
      [userId]
    );

    const averageScore =
      quizzes.length > 0
        ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length)
        : 0;

    // --------------------------
    // 4. Recent activity
    // --------------------------
    const [recentDocuments] = await pool.query(
      'SELECT id, title, file_name AS fileName, last_accessed AS lastAccessed, status FROM documents WHERE user_id = ? ORDER BY last_accessed DESC LIMIT 5',
      [userId]
    );

    const [recentQuizzes] = await pool.query(
      `SELECT q.id, q.title, q.score, q.total_questions AS totalQuestions, q.completed_at AS completedAt, d.title AS documentTitle
       FROM quizzes q
       JOIN documents d ON q.document_id = d.id
       WHERE q.user_id = ?
       ORDER BY q.created_at DESC
       LIMIT 5`,
      [userId]
    );

    // --------------------------
    // 5. Total generated images & articles
    // --------------------------
    const [[{ totalGeneratedImages }]] = await pool.query(
      `SELECT COUNT(*) AS totalGeneratedImages 
       FROM creations 
       WHERE user_id = ? AND type = 'image'`,
      [userId]
    );

    const [[{ totalGeneratedArticles }]] = await pool.query(
      `SELECT COUNT(*) AS totalGeneratedArticles 
       FROM creations 
       WHERE user_id = ? AND type = 'article'`,
      [userId]
    );

    // --------------------------
    // 6. Study streak (mocked)
    // --------------------------
    const studyStreak = Math.floor(Math.random() * 7) + 1;

    // --------------------------
    // 7. Response
    // --------------------------
    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalDocuments,
          totalFlashcardSets,
          totalFlashcards,
          reviewFlashcards,
          starredFlashcards,
          totalQuizzes,
          completedQuizzes,
          averageScore,
          totalGeneratedImages,
          totalGeneratedArticles, // <--- added here
          studyStreak,
        },
        recentActivity: {
          documents: recentDocuments,
          quizzes: recentQuizzes.map(q => ({
            id: q.id,
            title: q.title,
            score: q.score,
            totalQuestions: q.totalQuestions,
            completedAt: q.completedAt,
            document: { title: q.documentTitle }
          }))
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
