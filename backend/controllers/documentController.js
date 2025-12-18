import pool from '../config/db.js';
import fs from 'fs/promises';
import path from 'path';
import { extractTextFromPDF } from '../utils/pdfParser.js';
import { chunkText } from '../utils/textChunker.js';

// -------------------
// Upload PDF document
// POST /api/documents/upload
// -------------------
export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a PDF file",
        statusCode: 400,
      });
    }

    const { title } = req.body;
    if (!title) {
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error: "Please provide a document title",
        statusCode: 400,
      });
    }

    const fileUrl = `/uploads/documents/${req.file.filename}`; // store relative path

    // Insert document record
    const [result] = await pool.query(
      `INSERT INTO documents 
       (user_id, title, file_name, file_path, file_size, status, upload_date, last_accessed)
       VALUES (?, ?, ?, ?, ?, 'processing', NOW(), NOW())`,
      [req.user.id, title, req.file.originalname, fileUrl, req.file.size]
    );

    const documentId = result.insertId;

    // Process PDF in background
    processPDF(documentId, req.file.path).catch(console.error);

    res.status(201).json({
      success: true,
      data: { id: documentId, title, fileName: req.file.originalname, filePath: fileUrl },
      message: "Document uploaded successfully, processing in progress..."
    });

  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    next(error);
  }
};

// -------------------
// Helper: Process PDF
// Extract text, chunk it, store in document_chunks table
// -------------------
const processPDF = async (documentId, filePath) => {
  try {
    const { text } = await extractTextFromPDF(filePath);
    const chunks = chunkText(text, 500, 50); // array of { content, pageNumber, chunkIndex }

    // Insert chunks
    for (let chunk of chunks) {
      await pool.query(
        `INSERT INTO document_chunks (document_id, content, page_number, chunk_index) VALUES (?, ?, ?, ?)`,
        [documentId, chunk.content, chunk.pageNumber, chunk.chunkIndex]
      );
    }

    // Update document status and extracted text
    await pool.query(
      `UPDATE documents SET extracted_text = ?, status = 'ready' WHERE id = ?`,
      [text, documentId]
    );

    console.log(`Document ${documentId} processed successfully`);
  } catch (error) {
    console.error(`Error processing document ${documentId}`, error);
    await pool.query(`UPDATE documents SET status = 'failed' WHERE id = ?`, [documentId]);
  }
};

// -------------------
// Get all documents for a user
// GET /api/documents
// -------------------

export const getDocuments = async (req, res, next) => {
  try {
    const [documents] = await pool.query(
      `SELECT 
          d.id, 
          d.title, 
          d.file_name, 
          d.file_path, 
          d.file_size,        -- ✅ ADD THIS
          d.upload_date, 
          d.last_accessed,

          (SELECT COUNT(*) FROM flashcards f 
            WHERE f.document_id = d.id AND f.user_id = ?) AS flashcard_count,

          (SELECT COUNT(*) FROM quizzes q 
            WHERE q.document_id = d.id AND q.user_id = ?) AS quiz_count

       FROM documents d
       WHERE d.user_id = ?
       ORDER BY d.upload_date DESC`,
      [req.user.id, req.user.id, req.user.id]
    );

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    next(error);
  }
};


// -------------------
// Get a single document by ID
// GET /api/documents/:id
// -------------------
export const getDocument = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM documents WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        statusCode: 404
      });
    }

    const document = rows[0];

    // Get counts of flashcards and quizzes
    const [[{ flashcard_count }]] = await pool.query(
      `SELECT COUNT(*) AS flashcard_count FROM flashcards WHERE document_id = ? AND user_id = ?`,
      [document.id, req.user.id]
    );

    const [[{ quiz_count }]] = await pool.query(
      `SELECT COUNT(*) AS quiz_count FROM quizzes WHERE document_id = ? AND user_id = ?`,
      [document.id, req.user.id]
    );

    // Update last_accessed
    await pool.query(`UPDATE documents SET last_accessed = NOW() WHERE id = ?`, [document.id]);

    document.flashcardCount = flashcard_count;
    document.quizCount = quiz_count;

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

// -------------------
// Delete a document
// DELETE /api/documents/:id
// -------------------
// -------------------
// Delete a document
// DELETE /api/documents/:id
// -------------------
export const deleteDocument = async (req, res, next) => {
  try {

    // Step 1 - Check if document exists
    const [rows] = await pool.query(
      `SELECT * FROM documents WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
        statusCode: 404
      });
    }

    const document = rows[0];

    // Step 2 - Delete file from storage
    const filePath = path.join(process.cwd(), document.file_path.replace(/^\/+/, ''));
    await fs.unlink(filePath).catch(() => {});

    // ❌ REMOVED CHAT FEATURE DELETE STEP

    // Step 3 - Delete flashcard items
    await pool.query(
      `DELETE FROM flashcard_items 
       WHERE flashcard_id IN (SELECT id FROM flashcards WHERE document_id = ?)`,
      [document.id]
    ).catch(() => {});

    // Step 4 - Delete flashcards
    await pool.query(
      `DELETE FROM flashcards WHERE document_id = ?`,
      [document.id]
    );

    // Step 5 - Delete document chunks
    await pool.query(
      `DELETE FROM document_chunks WHERE document_id = ?`,
      [document.id]
    );

    // Step 6 - Finally delete the document
    await pool.query(
      `DELETE FROM documents WHERE id = ?`,
      [document.id]
    );

    res.status(200).json({
      success: true,
      message: "Document deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};
