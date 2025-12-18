// errorHandler.js
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Server Error";

    console.error("🔥 Error:", err); // For debugging

    // --------------------------
    // 1. SQL / Prisma / MySQL Duplicate Key Error
    // --------------------------
    if (err.code === "ER_DUP_ENTRY" || err.code === "P2002") {
        const field = err.meta?.target?.[0] || "Field";
        message = `${field} already exists`;
        statusCode = 400;
    }

    // --------------------------
    // 2. SQL / Prisma Foreign Key Constraint
    // --------------------------
    if (err.code === "ER_ROW_IS_REFERENCED" || err.code === "P2003") {
        message = "Foreign key constraint failed";
        statusCode = 400;
    }

    // --------------------------
    // 3. SQL / Prisma Record not found
    // --------------------------
    if (err.code === "P2025") {
        message = "Resource not found";
        statusCode = 404;
    }

    // --------------------------
    // 4. Validation Errors
    // --------------------------
    if (err.name === "ValidationError" || (err.errors && Array.isArray(err.errors))) {
        message = err.errors
            ? err.errors.map((e) => e.msg || e.message).join(", ")
            : err.message;
        statusCode = 400;
    }

    // --------------------------
    // 5. JWT Errors
    // --------------------------
    if (err.name === "JsonWebTokenError") {
        message = "Invalid token";
        statusCode = 401;
    }

    if (err.name === "TokenExpiredError") {
        message = "Token has expired";
        statusCode = 401;
    }

    // --------------------------
    // 6. Multer Errors
    // --------------------------
    if (err.code === "LIMIT_FILE_SIZE") {
        message = "File size exceeds the maximum limit of 10MB";
        statusCode = 400;
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
        message = "Too many files uploaded";
        statusCode = 400;
    }

    // --------------------------
    // 7. Syntax errors (JSON parsing errors)
    // --------------------------
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        message = "Invalid JSON format";
        statusCode = 400;
    }

    // --------------------------
    // 8. Not Found Routes
    // --------------------------
    if (err.status === 404 && !err.message) {
        message = "Route not found";
        statusCode = 404;
    }

    // --------------------------
    // 9. Fallback
    // --------------------------
    if (!message) {
        message = "Server Error";
        statusCode = 500;
    }

    return res.status(statusCode).json({
        success: false,
        error: message,
        statusCode,
    });
};

export default errorHandler;
