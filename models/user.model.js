import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
