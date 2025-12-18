import pool from "../config/db.js";

// ----------------------------
// Get All Articles
// GET /api/articles
// ----------------------------
export const getAllArticles = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized", statusCode: 401 });

    const [rows] = await pool.query(
      "SELECT id, prompt AS title, content, created_at FROM creations WHERE user_id = ? AND type = 'article' ORDER BY created_at DESC",
      [userId]
    );

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

// ----------------------------
// Get Article by ID
// GET /api/articles/:id
// ----------------------------
export const getArticleById = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized", statusCode: 401 });

    const [rows] = await pool.query(
      "SELECT id, prompt AS title, content, created_at FROM creations WHERE id = ? AND user_id = ? AND type = 'article'",
      [id, userId]
    );

    if (rows.length === 0) return res.status(404).json({ success: false, error: "Article not found", statusCode: 404 });

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

// ----------------------------
// Delete Article
// DELETE /api/articles/:id
// ----------------------------
export const deleteArticle = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized", statusCode: 401 });

    const [result] = await pool.query(
      "DELETE FROM creations WHERE id = ? AND user_id = ? AND type = 'article'",
      [id, userId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: "Article not found", statusCode: 404 });

    res.status(200).json({ success: true, message: "Article deleted successfully" });
  } catch (error) {
    next(error);
  }
};