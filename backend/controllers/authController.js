import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from '../config/db.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// -------------------
// Register new user
// POST /api/auth/register
// -------------------
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        error: existingUser[0].email === email
          ? "Email already registered"
          : "Username already taken",
        statusCode: 400,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    const token = generateToken(result.insertId);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: result.insertId,
          username,
          email,
          profileImage: null,
        },
        token,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// -------------------
// Login user
// POST /api/auth/login
// -------------------
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
        statusCode: 400,
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
        statusCode: 401,
      });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
        statusCode: 401,
      });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImage: user.profile_image,
      },
      token,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

// -------------------
// Get Profile
// GET /api/auth/profile
// -------------------
export const getProfile = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// -------------------
// Update Profile
// PUT /api/auth/profile
// -------------------
export const updateProfile = async (req, res, next) => {
  try {
    const { username, email, profileImage } = req.body;

    const [result] = await pool.query(
      "UPDATE users SET username = COALESCE(?, username), email = COALESCE(?, email), updated_at = NOW() WHERE id = ?",
      [username, email, profileImage, req.user.id]
    );

    const [updatedRows] = await pool.query(
      "SELECT id, username, email FROM users WHERE id = ?",
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      data: updatedRows[0],
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// -------------------
// Change Password
// PUT /api/auth/password-change
// -------------------
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Please provide current and new password",
        statusCode: 400,
      });
    }

    const [rows] = await pool.query(
      "SELECT password FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        statusCode: 404,
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
        statusCode: 401,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      req.user.id,
    ]);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
