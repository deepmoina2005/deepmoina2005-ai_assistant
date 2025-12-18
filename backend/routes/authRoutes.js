import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  getProfile,
  changePassword,
  updateProfile,
} from "../controllers/authController.js";
import protect from "../middlware/auth.js";

const router = express.Router();

// Validation middleware
const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
    body("password")
    .isLength({min: 8})
    .withMessage('Password must be at least 6 chracters')
];

const loginValidation = [
    body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
    body("password")
    .notEmpty()
    .withMessage('Password is required')
];

//  Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;