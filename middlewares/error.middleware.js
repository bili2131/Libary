// מידלוור לטיפול בנתיב שלא נמצא (404)
export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        type: "client error",
        error: "Endpoint not found"
    });
};

// מידלוור לטיפול בשגיאות שרת כלליות (500)
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        type: "server error",
        error: err.message || "Internal server error"
    });
};