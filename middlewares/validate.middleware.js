import Joi from 'joi';

// middleware creator:

export const validateSchema = (joiSchema, source = 'body') => {
    return (req, res, next) => {
        // abortEarly: false = לא לעצור בשגיאה הראשונה, אלא לאסוף את כולן
        const { value, error } = joiSchema.validate(req[source] ?? {}, { abortEarly: false });

        if (error) {
            // מעבירים למידלוור השגיאות מערך עם כל השגיאות
            return next({
                status: 400,
                message: 'Validation failed',
                errors: error.details.map((d) => ({
                    field: d.path.join('.'),   // באיזה שדה הבעיה
                    message: d.message         // מה הבעיה
                }))
            });
        }

        // הכל תקין - שומרים את הנתונים אחרי הבדיקה (כולל ברירות מחדל) וממשיכים
        if (source === 'body') req.body = value;
        next();
    };
};

// סכמה לבדיקת id בכתובת (למחיקה ועדכון)

export const idJoi = Joi.object({
    id: Joi.string().hex().length(24).required()
        .messages({
            'string.hex': 'Invalid id format',
            'string.length': 'Invalid id format'
        })
});