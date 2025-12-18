import pool from "../config/db.js";

// ----------------------------
// Get All Images
// GET /api/images
// ----------------------------
export const getAllImages = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) 
      return res.status(401).json({ success: false, error: "Unauthorized", statusCode: 401 });

    const [rows] = await pool.query(
      "SELECT id, prompt AS title, content AS url, created_at FROM creations WHERE user_id = ? AND type = 'image' ORDER BY created_at DESC",
      [userId]
    );

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

// ----------------------------
// Get Image by ID
// GET /api/images/:id
// ----------------------------
export const getImageById = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) 
      return res.status(401).json({ success: false, error: "Unauthorized", statusCode: 401 });

    const [rows] = await pool.query(
      "SELECT id, prompt AS title, content AS url, created_at FROM creations WHERE id = ? AND user_id = ? AND type = 'image'",
      [id, userId]
    );

    if (rows.length === 0) 
      return res.status(404).json({ success: false, error: "Image not found", statusCode: 404 });

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

// ----------------------------
// Delete Image
// DELETE /api/images/:id
// ----------------------------
export const deleteImage = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) 
      return res.status(401).json({ success: false, error: "Unauthorized", statusCode: 401 });

    const [result] = await pool.query(
      "DELETE FROM creations WHERE id = ? AND user_id = ? AND type = 'image'",
      [id, userId]
    );

    if (result.affectedRows === 0) 
      return res.status(404).json({ success: false, error: "Image not found", statusCode: 404 });

    res.status(200).json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    next(error);
  }
};
