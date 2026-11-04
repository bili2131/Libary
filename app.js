import express, { json, urlencoded } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import bookRoute from './routes/book.route.js';
import userRoute from './routes/user.route.js';

import { addDateAndLogGet } from './middlewares/logger.middleware.js';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js';
import { connectDB } from './config/db.js';

const app = express();
const port = 5000;

app.use(cors()); // מאפשר גישה מכל מקור (או ניתן להגדיר origin ספציפי)
app.use(morgan('dev')); // מציג לוגים של בקשות בטרמינל

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.status(200).send("ברוכים הבאים לשרת הספריה שלי");
});

// חיבור הראוטרים
app.use('/books', bookRoute);
app.use('/users', userRoute);

app.use(notFoundHandler);
app.use(errorHandler);

app.use((req, res, next) => {
    res.status(404).json({ error: "Endpoint not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
});

// ==========================================
// הפעלת השרת
// ==========================================
try {
    await connectDB();
    app.listen(port, () => {
        console.log(`Library server listening on http://localhost:${port}`);
    });
} catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exitCode = 1;
}