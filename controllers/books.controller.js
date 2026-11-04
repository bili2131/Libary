import Book from "../models/book.model.js";
import User from "../models/user.model.js";

// קבלת כל הספרים (כולל חיפוש ופגינציה)
export const getBooks = async (req, res, next) => {
    try {
        const filter = {};

        // חיפוש לפי שם ספר (אם נשלח פרמטר search)
        if (req.query.search) {
            filter.name = { $regex: req.query.search, $options: 'i' };
        }

        // Pagination - ברירת מחדל: page = 1, limit = 5
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const total = await Book.countDocuments(filter);
        const books = await Book.find(filter).skip(skip).limit(limit);

        res.status(200).json({
            page,
            limit,
            total,
            books
        });
    } catch (err) {
        return next(err);
    }
};

// קבלת ספר לפי ID
export const getBookById = async (req, res, next) => {
    const id = req.params.id;

    try {
        const book = await Book.findById(id);
        if (!book) {
            return next({
                error: new Error('Book not found'),
                status: 404
            });
        }
        res.status(200).json(book);
    } catch (err) {
        return next(err);
    }
};

// יצירת ספר חדש
export const createBook = async (req, res, next) => {
    const { name, categories, price } = req.body;

    if (!name || !Array.isArray(categories) || categories.length === 0 || price === undefined) {
        return res.status(400).json({ error: "Missing required book fields" });
    }

    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json(newBook);
    } catch (err) {
        return next(err);
    }
};

// עדכון פרטי ספר
export const updateBook = async (req, res, next) => {
    const id = req.params.id;

    try {
        const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedBook) {
            return next({
                error: new Error('Book not found'),
                status: 404
            });
        }

        res.status(200).json(updatedBook);
    } catch (err) {
        return next(err);
    }
};

// ביצוע השאלת ספר
export const createLoan = async (req, res, next) => {
    const { bookId, userId } = req.body;

    if (!bookId || !userId) {
        return res.status(400).json({ error: "bookId and userId are required" });
    }

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        if (book.isBorrowed) {
            return res.status(400).json({ error: "Book is already borrowed" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 1. עדכון סטטוס הספר למושאל
        book.isBorrowed = true;
        await book.save();

        // 2. הוספת מזהה הספר למשתמש
        if (!user.borrowedBooks.includes(bookId)) {
            user.borrowedBooks.push(bookId);
            await user.save();
        }

        res.status(201).json({
            message: "Loan completed successfully",
            bookId,
            userId
        });
    } catch (err) {
        return next(err);
    }
};

// החזרת ספר
export const returnBook = async (req, res, next) => {
    const id = req.params.id;

    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        if (!book.isBorrowed) {
            return res.status(400).json({ error: "Book is not currently borrowed" });
        }

        // 1. עדכון סטטוס הספר
        book.isBorrowed = false;
        await book.save();

        // 2. הסרת הספר מהמשתמש שמחזיק אותו ב-DB
        await User.updateMany(
            { borrowedBooks: id },
            { $pull: { borrowedBooks: id } }
        );

        res.status(200).json({ message: "Book returned successfully", book });
    } catch (err) {
        return next(err);
    }
};

// מחיקת ספר
export const deleteBook = async (req, res, next) => {
    const id = req.params.id;

    try {
        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) {
            return next({
                error: new Error('Book not found'),
                status: 404
            });
        }

        // ניקוי המזהה של הספר מרשימות השאלה של משתמשים
        await User.updateMany(
            { borrowedBooks: id },
            { $pull: { borrowedBooks: id } }
        );

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (err) {
        return next({ err });
    }
};