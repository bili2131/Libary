import express from 'express';
import {getBooks, getBookById, createBook, updateBook, createLoan,  returnBook,  deleteBook } from '../controllers/books.controller.js';
import { checkAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBook);
router.post('/loans', checkAuth, createLoan);
router.patch('/:id/return', returnBook);
router.delete('/:id', deleteBook);

export default router;