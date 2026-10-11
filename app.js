import express, { json, urlencoded } from 'express';
import bookRoute from './routes/book.route.js'; 
import userRoute from './routes/user.route.js'; 

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

const port = 5000;

app.get('/', (req, res) => {
    res.status(200).send("ברוכים הבאים לשרת הספריה שלי");
});

// חיבור נתבי הספרים והמשתמשים לשרת
app.use('/books', bookRoute);   
app.use('/users', userRoute); 

// הרצת השרת על הפורט שהגדרנו
app.listen(port, () => {
    console.log(`Library server listening on http://localhost:${port}`);
});