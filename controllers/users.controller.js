import { db } from '../db.js';

export const getUsers = (req, res) => {
    res.status(200).json(db.users);
};

export const registerUser = (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields: name, email, and password are required" });
    }

    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
    }

    const newId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 101;
    
    const newUser = {
        id: newId,
        name,
        email,
        password, 
        borrowedBooks: [] 
    };

    db.users.push(newUser);
    res.status(201).json({ message: "User registered successfully", user: newUser });
};

export const loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({ 
        message: "Login successful", 
        user: { 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            borrowedBooks: user.borrowedBooks 
        } 
    });
};