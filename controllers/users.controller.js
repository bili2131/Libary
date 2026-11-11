
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const register = async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.save();

        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            address: user.address
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !password || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            address: user.address
        });
    } catch (err) {
        next(err);
    }
};