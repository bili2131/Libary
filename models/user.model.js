import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
// סכמות Joi - בדיקת תקינות של הנתונים שנשלחים מהלקוח
export const userJoi = {
  // הרשמה - כל השדות חובה
  register: Joi.object({
    username: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/)
      .required()
      .messages({
        'string.pattern.base':
          'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.'
      }),
    phone: Joi.string().pattern(/^0\d{1,2}-?\d{7}$/).required()
      .messages({ 'string.pattern.base': 'Phone must be a valid Israeli phone number.' }),
    address: Joi.string().required()
  }),

  // התחברות - רק אימייל וסיסמה
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // עדכון - כל השדות רשות, אבל חייב לפחות שדה אחד
  update: Joi.object({
    username: Joi.string().min(2).max(30),
    email: Joi.string().email(),
    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/)
      .messages({
        'string.pattern.base':
          'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.'
      }),
    phone: Joi.string().pattern(/^0\d{1,2}-?\d{7}$/)
      .messages({ 'string.pattern.base': 'Phone must be a valid Israeli phone number.' }),
    address: Joi.string()
  }).min(1)
};

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  borrowedBooks: [{ type: Schema.Types.ObjectId, ref: 'books' }]
});

userSchema.pre('save', async function () {
  // מצפינים רק אם הסיסמה חדשה או השתנתה
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// יצירת טוקן לפי פרטי המשתמש - בתוקף ל-5 דקות
export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },  
    process.env.JWT_SECRET,            
    { expiresIn: '5m' }               
  );
};

export default model('User', userSchema);
