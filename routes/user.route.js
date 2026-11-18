
import { Router } from 'express';
import { login, register, getAllUsers, updateUser } from '../controllers/users.controller.js';
import { checkAuth, checkAdmin } from '../middlewares/auth.middleware.js';

const route = Router();

route.post('/login', login);
route.post('/register', register);

// קבלת כל המשתמשים - מנהל בלבד
route.get('/', checkAuth, checkAdmin, getAllUsers);

// עדכון משתמש - משתמש מחובר (הבדיקה שזה הוא עצמו בתוך ה-controller)
route.put('/:id', checkAuth, updateUser);

export default route;