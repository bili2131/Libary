import { db } from '../db.js';

export const getBooks = (req, res) => {
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
};

export const getBookById = (req, res) => {
    const id = +req.params.id;
    const book = db.books.find(b => b.id === id);
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(book);
};

export const createBook = (req, res) => {
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
};

export const updateBook = (req, res) => {
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
};

export const createLoan = (req, res) => {
    const { bookId, userId } = req.body;
    if (!bookId || !userId) {
        return res.status(400).json({ error: "bookId and userId are required" });
    }

    const book = db.books.find(b => b.id === +bookId);
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    if (book.isBorrowed) {
        return res.status(400).json({ error: "Book is already borrowed" });
    }

    const user = db.users.find(u => u.id === +userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // 1. עדכון סטטוס הספר
    book.isBorrowed = true;

    // 2. הוספת הספר למערך הספרים המושאלים של המשתמש
    if (!user.borrowedBooks.includes(+bookId)) {
        user.borrowedBooks.push(+bookId);
    }

    // 3. הוספת תיעוד לטבלת ההשאלות
    const newLoan = {
        loanId: db.loans.length > 0 ? Math.max(...db.loans.map(l => l.loanId)) + 1 : 1,
        borrowDate: new Date().toISOString().split('T')[0],
        bookId: +bookId,
        userId: +userId
    };

    db.loans.push(newLoan);
    res.status(201).json({ message: "Loan completed successfully", loan: newLoan });
};

export const returnBook = (req, res) => {
    const id = +req.params.id;
    const book = db.books.find(b => b.id === id);
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    if (!book.isBorrowed) {
        return res.status(400).json({ error: "Book is not currently borrowed" });
    }

    // 1. עדכון סטטוס הספר
    book.isBorrowed = false;

    // 2. הסרת הספר ממערך borrowedBooks של המשתמש שמחזיק אותו
    db.users.forEach(user => {
        const bookIndex = user.borrowedBooks.indexOf(id);
        if (bookIndex !== -1) {
            user.borrowedBooks.splice(bookIndex, 1);
        }
    });

    // 3. הסרת ההשאלה ממאגר ההשאלות הפעילות
    db.loans = db.loans.filter(l => l.bookId !== id);

    res.status(200).json({ message: "Book returned successfully", book });
};

export const deleteBook = (req, res) => {
    const id = +req.params.id;
    const initialLength = db.books.length;
    db.books = db.books.filter(b => b.id !== id);

    if (db.books.length === initialLength) {
        return res.status(404).json({ error: "Book not found" });
    }

    // ניקוי נלווה
    db.users.forEach(user => {
        const index = user.borrowedBooks.indexOf(id);
        if (index !== -1) user.borrowedBooks.splice(index, 1);
    });
    db.loans = db.loans.filter(l => l.bookId !== id);

    res.status(200).json({ message: "Book deleted successfully" });
};