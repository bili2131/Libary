import { model, Schema } from 'mongoose';

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    borrowedBooks: [{ type: Schema.Types.ObjectId, ref: 'books' }]
});

export default model('users', userSchema);