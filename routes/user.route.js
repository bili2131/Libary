
import { Router } from 'express';
import { login, register, getAllUsers, updateUser } from '../controllers/users.controller.js';
import { checkAuth, checkAdmin } from '../middlewares/auth.middleware.js';
import { validateSchema, idJoi } from '../middlewares/validate.middleware.js';
import { userJoi } from '../models/user.model.js';

const route = Router();

route.post('/login', validateSchema(userJoi.login), login);
route.post('/register', validateSchema(userJoi.register), register);

// קבלת כל המשתמשים - מנהל בלבד
route.get('/', checkAuth, checkAdmin, getAllUsers);

// עדכון משתמש - מחובר + id תקין + body תקין
route.put('/:id', checkAuth, validateSchema(idJoi, 'params'), validateSchema(userJoi.update), updateUser);

export default route;