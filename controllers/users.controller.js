
import User, { generateToken } from '../models/user.model.js';
import bcrypt from 'bcryptjs';

// הרשמה
export const register = async (req, res, next) => {
    try {
        // לא נותנים למשתמש לקבוע לעצמו role (אחרת כל אחד יכול להירשם כמנהל)
        const { role, ...userData } = req.body;

        const user = new User(userData);
        await user.save();

        // רק אחרי הצלחה - יוצרים טוקן
        const token = generateToken(user);

        res.status(201).json({
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (err) {
        next(err);
    }
};

// התחברות
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !password || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // רק אחרי הצלחה - יוצרים טוקן
        const token = generateToken(user);

        res.status(200).json({
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (err) {
        next(err);
    }
};

// קבלת כל המשתמשים (מנהל בלבד - )
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password'); // בלי הסיסמאות
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
};

// עדכון משתמש - רק המשתמש עצמו
export const updateUser = async (req, res, next) => {
    const id = req.params.id;

    // האם ה-id בטוקן זהה ל-id בכתובת?
    if (req.user.id !== id) {
        return res.status(403).json({ error: 'You can update only your own user.' });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // לא מאפשרים לשנות role דרך העדכון
        const { role, ...updates } = req.body;
        Object.assign(user, updates);
        await user.save(); // save (ולא findByIdAndUpdate) - כדי שסיסמה חדשה תוצפן

        res.status(200).json({ id: user._id, username: user.username, email: user.email, phone: user.phone, address: user.address });
    } catch (err) {
        next(err);
    }
};