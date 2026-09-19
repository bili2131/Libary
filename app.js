import express from 'express';

import { db } from './db.js';

const app = express();

app.use(express.json());

const port = 5000;

// ==========================================
// ENDPOINTS
// ==========================================

app.get('/', (req, res) => {
    res.status(200).send(" ברוכים הבאים לשרת הספריה שלי ");
});

app.get('/books', (req, res) => {
    let result = db.books;

    // חיפוש לפי שם ספר (אם נשלח פרמטר search)
    if (req.query.search) {
        const searchTerm = req.query.search.toLowerCase();
        result = result.filter(b => b.name.toLowerCase().includes(searchTerm));
    }

    // Pagination - ברירת מחדל: page = 1, limit = 5
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedBooks = result.slice(startIndex, endIndex);

    // מחזיר אובייקט מסודר עם מטא-דאטה והספרים
    res.status(200).json({
        page,
        limit,
        total: result.length,
        books: paginatedBooks
    });
});

app.get('/books/:id', (req, res) => {
    const id = +req.params.id;
    const book = db.books.find(b => b.id === id);
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(book);
});

app.post('/books', (req, res) => {
    const { name, category, price, isBorrowed } = req.body;
    if (!name || !category || price === undefined) {
        return res.status(400).json({ error: "Missing required book fields" });
    }

    const newId = db.books.length > 0 ? Math.max(...db.books.map(b => b.id)) + 1 : 1;
    const newBook = {
        id: newId,
        name,
        category,
        price,
        isBorrowed: isBorrowed !== undefined ? isBorrowed : false
    };

    db.books.push(newBook);
    res.status(201).json(newBook);
});

app.put('/books/:id', (req, res) => {
    const id = +req.params.id;
    const book = db.books.find(b => b.id === id);
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    const { name, category, price, isBorrowed } = req.body;
    if (name !== undefined) book.name = name;
    if (category !== undefined) book.category = category;
    if (price !== undefined) book.price = price;
    if (isBorrowed !== undefined) book.isBorrowed = isBorrowed;

    res.status(200).json(book);
});

app.post('/loans', (req, res) => {
    const { bookId, userId } = req.body;
    if (!bookId || !userId) {
        return res.status(400).json({ error: "bookId and userId are required" });
    }

    const book = db.books.find(b => b.id === +bookId);
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    // ביצוע השאלה רק אם הספר לא מושאל
    if (book.isBorrowed) {
        return res.status(400).json({ error: "Book is already borrowed" });
    }

    book.isBorrowed = true;
    const newLoan = {
        loanId: db.loans.length > 0 ? Math.max(...db.loans.map(l => l.loanId)) + 1 : 1,
        borrowDate: new Date().toISOString().split('T')[0],
        bookId: +bookId,
        userId: +userId
    };

    db.loans.push(newLoan);
    res.status(201).json({ message: "Loan completed successfully", loan: newLoan });
});

app.patch('/books/:id/return', (req, res) => {
    const id = +req.params.id;
    const book = db.books.find(b => b.id === id);
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    book.isBorrowed = false;
    res.status(200).json({ message: "Book returned successfully", book });
});

app.delete('/books/:id', (req, res) => {
    const id = +req.params.id;
    const initialLength = db.books.length;
    db.books = db.books.filter(b => b.id !== id);

    if (db.books.length === initialLength) {
        return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully" });
});

// הרצת השרת על הפורט שהגדרנו
app.listen(port, () => {
    console.log(`Library server listening on http://localhost:${port}`);
});