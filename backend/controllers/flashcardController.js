import pool from '../config/db.js';

// -------------------
// Get all flashcards for a document
// GET /api/flashcard/:documentId
// -------------------
export const getFlashcards = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const documentId = req.params.documentId;

    // 1️⃣ Get all flashcard sets for this user and document
    const [flashcardSets] = await pool.query(
      `SELECT f.id AS flashcardSetId, f.user_id AS userId, f.document_id AS documentId,
              d.title AS documentTitle, d.file_name AS documentFileName
       FROM flashcards f
       JOIN documents d ON f.document_id = d.id
       WHERE f.user_id = ? AND f.document_id = ?
       ORDER BY f.created_at DESC`,
      [userId, documentId]
    );

    if (flashcardSets.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        message: 'No flashcards found for this document'
      });
    }

    // 2️⃣ For each flashcard set, get its cards
    const setsWithCards = [];
    for (const set of flashcardSets) {
      const [cards] = await pool.query(
        `SELECT id, question, answer, difficulty, last_reviewed AS lastReviewed,
                review_count AS reviewCount, is_starred AS isStarred
         FROM flashcard_items
         WHERE flashcard_id = ?`,
        [set.flashcardSetId]
      );

      setsWithCards.push({
        ...set,
        cards // array of card objects
      });
    }

    // 3️⃣ Send response
    res.status(200).json({
      success: true,
      count: setsWithCards.length,
      data: setsWithCards
    });
  } catch (error) {
    next(error);
  }
};


// -------------------
// Get all flashcard sets for a user
// GET /api/flashcards
// -------------------
export const getAllFlashcardSets = async (req, res, next) => {
  try {
    const [flashcardSets] = await pool.query(`
      SELECT 
        f.id AS flashcard_set_id,
        f.user_id,
        f.document_id,
        f.created_at,
        d.title AS document_title,
        COALESCE(JSON_ARRAYAGG(JSON_OBJECT(
          'id', fi.id,
          'question', fi.question,
          'answer', fi.answer,
          'lastReviewed', fi.last_reviewed,
          'reviewCount', fi.review_count,
          'isStarred', fi.is_starred
        )), JSON_ARRAY()) AS cards
      FROM flashcards f
      JOIN documents d ON d.id = f.document_id
      LEFT JOIN flashcard_items fi ON fi.flashcard_id = f.id
      WHERE f.user_id = ?
      GROUP BY f.id
      ORDER BY f.created_at DESC
    `, [req.user.id]);

    res.status(200).json({
      success: true,
      count: flashcardSets.length,
      data: flashcardSets
    });
  } catch (error) {
    next(error);
  }
};


// -------------------
// Mark a flashcard as reviewed
// POST /api/flashcard/:cardId/review
// -------------------
export const reviewFlashCard = async (req, res, next) => {
  try {
    const [cardRows] = await pool.query(
      `SELECT fi.id, fi.review_count
       FROM flashcard_items fi
       JOIN flashcards f ON fi.flashcard_id = f.id
       WHERE fi.id = ? AND f.user_id = ?`,
      [req.params.cardId, req.user.id]
    );

    if (cardRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Flashcard set or card not found',
        statusCode: 404
      });
    }

    await pool.query(
  `UPDATE flashcard_items 
   SET last_reviewed = NOW(), review_count = review_count + 1
   WHERE id = ?`,
  [req.params.cardId]
);

const [updatedCard] = await pool.query(
  `SELECT id, question, answer, last_reviewed AS lastReviewed, review_count AS reviewCount
   FROM flashcard_items
   WHERE id = ?`,
  [req.params.cardId]
);

res.status(200).json({
  success: true,
  message: "Flashcard reviewed successfully",
  data: updatedCard[0]
});

  } catch (error) {
    next(error);
  }
};

// -------------------
// Toggle star/favorite on a flashcard
// PUT /api/flashcards/:cardId/star
// -------------------
export const toggleStarFlashcard = async (req, res, next) => {
  try {
    const [cardRows] = await pool.query(
      `SELECT fi.is_starred
       FROM flashcard_items fi
       JOIN flashcards f ON fi.flashcard_id = f.id
       WHERE fi.id = ? AND f.user_id = ?`,
      [req.params.cardId, req.user.id]
    );

    if (cardRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Flashcard set or card not found',
        statusCode: 404
      });
    }

    const newStarStatus = !cardRows[0].is_starred;

    await pool.query(
      `UPDATE flashcard_items SET is_starred = ? WHERE id = ?`,
      [newStarStatus, req.params.cardId]
    );

    res.status(200).json({
      success: true,
      message: `Flashcard ${newStarStatus ? 'starred' : 'unstarred'}`,
      data: { cardId: req.params.cardId, isStarred: newStarStatus }
    });
  } catch (error) {
    next(error);
  }
};

// -------------------
// Delete flashcard set
// DELETE /api/flashcards/:id
// -------------------
export const deleteFlashcardSet = async (req, res, next) => {
  try {
    // Check ownership
    const [rows] = await pool.query(
      `SELECT id FROM flashcards WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Flashcard set not found',
        statusCode: 404
      });
    }

    // Delete flashcard items first
    await pool.query(
      `DELETE FROM flashcard_items WHERE flashcard_id = ?`,
      [req.params.id]
    );

    // Delete flashcard set
    await pool.query(
      `DELETE FROM flashcards WHERE id = ?`,
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      message: 'Flashcard set deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
