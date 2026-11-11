
import { Schema, model } from 'mongoose';
// User model schema for MongoDB using Mongoose
// התקנת סיפריית BYcrypt לשם הצפנת סיסמאות
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true }
});

userSchema.pre('save', async function() {
  const salt = await bcrypt.genSalt(10);
  const hash= await bcrypt.hash(this.password, salt);
  this.password = hash;

});

export default model('User', userSchema);
