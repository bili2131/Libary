import { model, Schema } from "mongoose";

// הגדרת תבניתם (Schema)
const bookSchema = new Schema({
    name: String,
    price: Number,
    categories: [String],
    author: {
        name: String,
        phone: String,
        email: String
    },
    isBorrowed: Boolean
});

export default model('books', bookSchema);