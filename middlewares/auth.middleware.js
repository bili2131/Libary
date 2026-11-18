import jwt from 'jsonwebtoken';

// בדיקה: יש טוקן, והטוקן בתוקף
export const checkAuth = (req, res, next) => {
   
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // verify בודק שהחתימה אמיתית ושהתוקף לא עבר
        // אם הכול תקין - מחזיר את מה ששמרנו בטוקן: { id, role }
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next(); // מותר להמשיך
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

// בדיקה: המשתמש מנהל (תמיד בא אחרי checkAuth)
export const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin only.' });
    }
    next();
};