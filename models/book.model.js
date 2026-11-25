import { model, Schema } from "mongoose";
import Joi from "joi";


// סכמות Joi לספרים
export const bookJoi = {
    // הוספת ספר
    create: Joi.object({
        name: Joi.string().min(1).max(100).required(),
        price: Joi.number().positive().required(),
        categories: Joi.array().items(Joi.string()).min(1).required(),
        author: Joi.object({
            name: Joi.string().required(),
            phone: Joi.string().pattern(/^0\d{1,2}-?\d{7}$/),
            email: Joi.string().email()
        }),
        isBorrowed: Joi.boolean().default(false)
    }),

    // עדכון ספר - הכל רשות, אבל לפחות שדה אחד
    update: Joi.object({
        name: Joi.string().min(1).max(100),
        price: Joi.number().positive(),
        categories: Joi.array().items(Joi.string()).min(1),
        author: Joi.object({
            name: Joi.string(),
            phone: Joi.string().pattern(/^0\d{1,2}-?\d{7}$/),
            email: Joi.string().email()
        }),
        isBorrowed: Joi.boolean()
    }).min(1)
};
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


