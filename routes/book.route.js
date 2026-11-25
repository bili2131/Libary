import express from 'express';
import { getBooks, getBookById, createBook, updateBook, createLoan, returnBook, deleteBook } from '../controllers/books.controller.js';
import { checkAuth } from '../middlewares/auth.middleware.js';
import { validateSchema, idJoi } from '../middlewares/validate.middleware.js';
import { bookJoi } from '../models/book.model.js';

const router = express.Router();

router.get('/', getBooks);
router.get('/:id', validateSchema(idJoi, 'params'), getBookById);

// הוספה - בודקים את ה-body מול סכמת יצירת ספר
router.post('/', validateSchema(bookJoi.create), createBook);

// עדכון - בודקים גם את ה-id בכתובת וגם את ה-body
router.put('/:id', validateSchema(idJoi, 'params'), validateSchema(bookJoi.update), updateBook);

router.post('/loans', checkAuth, createLoan);
router.patch('/:id/return', validateSchema(idJoi, 'params'), returnBook);

// מחיקה - אין body, אז בודקים את ה-id בכתובת
router.delete('/:id', validateSchema(idJoi, 'params'), deleteBook);

export default router;