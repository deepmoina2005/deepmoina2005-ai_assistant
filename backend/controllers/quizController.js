import pool from '../config/db.js';

// -------------------
// Get all quizzes for a document
// GET /api/quizzes/:documentId
// -------------------
export const getQuizzes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const documentId = req.params.documentId;

    // 1️⃣ Fetch all quizzes
    const [quizSets] = await pool.query(
      `SELECT q.id AS quizId, q.user_id AS userId, q.document_id AS documentId,
              q.title AS quizTitle, q.score, q.completed_at AS completedAt,
              q.created_at AS createdAt, q.user_answers,
              d.title AS documentTitle, d.file_name AS documentFileName
       FROM quizzes q
       JOIN documents d ON q.document_id = d.id
       WHERE q.user_id = ? AND q.document_id = ?
       ORDER BY q.created_at DESC`,
      [userId, documentId]
    );

    if (quizSets.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        message: "No quizzes found for this document",
      });
    }

    // 2️⃣ Fetch question counts using LEFT JOIN to ensure even 0 counts appear
    const quizIds = quizSets.map(q => q.quizId);
    const [questionCounts] = await pool.query(
      `SELECT q.id AS quizId, COUNT(qq.id) AS totalQuestions
       FROM quizzes q
       LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
       WHERE q.id IN (?)
       GROUP BY q.id`,
      [quizIds]
    );

    // Map quizId → question count
    const questionCountMap = {};
    questionCounts.forEach(qc => {
      questionCountMap[qc.quizId] = qc.totalQuestions;
    });

    // 3️⃣ Format quizzes for frontend
    const quizzesWithParsedAnswers = quizSets.map((quiz) => {
      let userAnswers = [];
      try {
        userAnswers = quiz.user_answers ? JSON.parse(quiz.user_answers) : [];
      } catch {
        userAnswers = [];
      }

      return {
        ...quiz,
        userAnswers,
        submitted: !!quiz.completedAt,
        questionsCount: questionCountMap[quiz.quizId] || 0, // correctly pass question count
      };
    });

    res.status(200).json({
      success: true,
      count: quizzesWithParsedAnswers.length,
      data: quizzesWithParsedAnswers,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------
// Get a single quiz by ID
// GET /api/quizzes/quiz/:id
// -------------------
export const getQuizById = async (req, res, next) => {
  try {
    const quizId = Number(req.params.id);

    // Fetch quiz
    const [quizRows] = await pool.query(
      `SELECT q.id AS quizId, q.user_id AS userId, q.document_id AS documentId,
              q.title AS quizTitle, q.score, q.total_questions AS totalQuestions,
              q.completed_at AS completedAt, d.title AS documentTitle, d.file_name AS documentFileName
       FROM quizzes q
       JOIN documents d ON q.document_id = d.id
       WHERE q.id = ? AND q.user_id = ?`,
      [quizId, req.user.id]
    );

    if (quizRows.length === 0) {
      return res.status(404).json({ success: false, error: "Quiz not found" });
    }

    const quiz = quizRows[0];

    // Fetch questions
    const [questions] = await pool.query(
      `SELECT id, quiz_id, question, correct_answer AS correctAnswer,
              explanation, difficulty
       FROM quiz_questions
       WHERE quiz_id = ?`,
      [quizId]
    );

    // Fetch options for all questions
    const questionIds = questions.map(q => q.id);
    let optionsMap = {};
    if (questionIds.length > 0) {
      const [optionsRows] = await pool.query(
        `SELECT id, question_id, option_text, is_correct
         FROM quiz_options
         WHERE question_id IN (?)`,
        [questionIds]
      );
      optionsRows.forEach(opt => {
        if (!optionsMap[opt.question_id]) optionsMap[opt.question_id] = [];
        optionsMap[opt.question_id].push({
          id: opt.id,
          text: opt.option_text,
          isCorrect: opt.is_correct === 1
        });
      });
    }

    const finalQuestions = questions.map(q => ({
      ...q,
      options: optionsMap[q.id] || []
    }));

    res.status(200).json({
      success: true,
      data: {
        ...quiz,
        questions: finalQuestions
      }
    });

  } catch (error) {
    next(error);
  }
};


// -------------------
// Submit quiz answers
// POST /api/quizzes/quiz/:id/submit
// -------------------
export const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ success: false, error: 'Please provide answers array' });
    }

    // Fetch quiz
    const [rows] = await pool.query(
      "SELECT * FROM quizzes WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Quiz not found' });

    const quiz = rows[0];

    if (quiz.completed_at) return res.status(400).json({ success: false, error: 'Quiz already completed' });

    // Fetch questions
    const [questionsRows] = await pool.query(
      "SELECT * FROM quiz_questions WHERE quiz_id = ?",
      [quiz.id]
    );

    if (!questionsRows || questionsRows.length === 0) {
      return res.status(400).json({ success: false, error: 'No questions found for this quiz' });
    }

    // Fetch options for questions
    const questionIds = questionsRows.map(q => q.id);
    let optionsMap = {};
    if (questionIds.length > 0) {
      const [optionsRows] = await pool.query(
        "SELECT * FROM quiz_options WHERE question_id IN (?)",
        [questionIds]
      );
      optionsRows.forEach(opt => {
        if (!optionsMap[opt.question_id]) optionsMap[opt.question_id] = [];
        optionsMap[opt.question_id].push({
          id: opt.id,
          text: opt.option_text,
          isCorrect: opt.is_correct === 1
        });
      });
    }

    // Attach options to questions
    const questions = questionsRows.map(q => ({
      ...q,
      options: optionsMap[q.id] || []
    }));

    // Check answers
    let correctCount = 0;
    const userAnswers = [];

    answers.forEach(ans => {
      const { questionIndex, selectedAnswer } = ans;
      if (questionIndex < questions.length) {
        const question = questions[questionIndex];
        const isCorrect = question.options.find(opt => opt.text === selectedAnswer)?.isCorrect || false;
        if (isCorrect) correctCount++;

        userAnswers.push({
          questionId: question.id,
          selectedAnswer,
          isCorrect,
          answeredAt: new Date()
        });
      }
    });

    const total = questions.length;
    const score = Math.round((correctCount / total) * 100);

    // Update quiz
    await pool.query(
      "UPDATE quizzes SET user_answers = ?, score = ?, completed_at = NOW() WHERE id = ?",
      [JSON.stringify(userAnswers), score, quiz.id]
    );

    res.status(200).json({
      success: true,
      data: { quizId: quiz.id, score, correctCount, totalQuestions: total, userAnswers },
      message: 'Quiz submitted successfully'
    });

  } catch (error) {
    next(error);
  }
};


// -------------------
// Get quiz results
// GET /api/quizzes/:id/results
// -------------------
export const getQuizResults = async (req, res, next) => {
try {
const quizId = Number(req.params.id);

// Fetch the quiz with document info
const [rows] = await pool.query(
  `SELECT q.*, d.title AS document_title 
   FROM quizzes q 
   JOIN documents d ON q.document_id = d.id 
   WHERE q.id = ? AND q.user_id = ?`,
  [quizId, req.user.id]
);

if (rows.length === 0) {
  return res.status(404).json({
    success: false,
    error: 'Quiz not found',
    statusCode: 404,
  });
}

const quiz = rows[0];

if (!quiz.completed_at) {
  return res.status(400).json({
    success: false,
    error: 'Quiz not completed yet',
    statusCode: 400,
  });
}

// Safely parse user_answers
let userAnswers = [];
try {
  userAnswers = typeof quiz.user_answers === 'string' ? JSON.parse(quiz.user_answers) : quiz.user_answers || [];
} catch {
  userAnswers = [];
}

// Fetch questions and options from database
const [questionsRows] = await pool.query(
  `SELECT id, question, correct_answer AS correctAnswer, explanation 
   FROM quiz_questions 
   WHERE quiz_id = ?`,
  [quizId]
);

// Fetch options for these questions
const questionIds = questionsRows.map(q => q.id);
let optionsMap = {};
if (questionIds.length > 0) {
  const [optionsRows] = await pool.query(
    `SELECT id, question_id, option_text, is_correct 
     FROM quiz_options 
     WHERE question_id IN (?)`,
    [questionIds]
  );
  optionsRows.forEach(opt => {
    if (!optionsMap[opt.question_id]) optionsMap[opt.question_id] = [];
    optionsMap[opt.question_id].push({
      id: opt.id,
      text: opt.option_text,
      isCorrect: opt.is_correct === 1
    });
  });
}

// Build detailed results
const detailedResults = questionsRows.map((q, index) => {
  const ua = userAnswers.find(a => a.questionId === q.id) || {};
  return {
    questionIndex: index,
    question: q.question || '',
    options: optionsMap[q.id] || [],
    correctAnswer: q.correctAnswer || null,
    selectedAnswer: ua.selectedAnswer || null,
    isCorrect: ua.isCorrect || false,
    explanation: q.explanation || '',
  };
});

res.status(200).json({
  success: true,
  data: {
    quiz: {
      id: quiz.id,
      title: quiz.title || '',
      document: { id: quiz.document_id, title: quiz.document_title || '' },
      score: quiz.score || 0,
      totalQuestions: quiz.total_questions || detailedResults.length,
      completedAt: quiz.completed_at,
    },
    results: detailedResults,
  },
});


} catch (error) {
next(error);
}
};


// -------------------
// Delete quiz
// DELETE /api/quizzes/:id
// -------------------
export const deleteQuiz = async (req, res, next) => {
    const quizId = Number(req.params.id);

    try {
        // delete questions first
        await pool.query("DELETE FROM quiz_questions WHERE quiz_id = ?", [quizId]);

        // delete the quiz
        const [result] = await pool.query(
            "DELETE FROM quizzes WHERE id = ? AND user_id = ?",
            [quizId, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Quiz not found" });
        }

        res.json({ success: true, message: "Quiz deleted" });
    } catch (error) {
        next(error);
    }
};