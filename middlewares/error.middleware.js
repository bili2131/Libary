// מידלוור לטיפול בנתיב שלא נמצא (404)
export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        type: "client error",
        error: "Endpoint not found"
    });
};

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        type: statusCode < 500 ? "client error" : "server error",
        error: err.message || err.error?.message || "Internal server error",
        // אם יש רשימת שגיאות (מ-Joi) - מחזירים אותה
        ...(err.errors && { errors: err.errors })
    });
};