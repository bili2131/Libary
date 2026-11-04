export const addDateAndLogGet = (req, res, next) => {
    // הוספת התאריך הנוכחי לאובייקט הבקשה
    req.currentDate = new Date().toISOString();

    // בדיקה האם הבקשה היא מסוג GET
    if (req.method === 'GET') {
        console.log(`[GET Request] Date: ${req.currentDate} | Path: ${req.originalUrl}`);
    }

    next();
};