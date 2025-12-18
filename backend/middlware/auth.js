import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // get user from MySQL
      const [rows] = await pool.query('SELECT id, username, email FROM users WHERE id = ?', [decoded.id]);

      if (!rows.length) {
        return res.status(401).json({
          success: false,
          error: 'User not found',
          statusCode: 401,
        });
      }

      req.user = rows[0]; // attach user info to req

      next();
    } catch (error) {
      console.error('Auth middleware:', error.message);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token has expired',
          statusCode: 401,
        });
      }

      return res.status(401).json({
        success: false,
        error: 'Not authorized, token failed',
        statusCode: 401,
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token',
      statusCode: 401,
    });
  }
};

export default protect;