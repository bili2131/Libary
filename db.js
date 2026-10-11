export let db = {
    books: [
        { id: 1, name: "Clean Code", category: "Programming", price: 120, isBorrowed: false },
        { id: 2, name: "Algorithmic Design", category: "Computer Science", price: 150, isBorrowed: true },
        { id: 3, name: "Database Systems", category: "Databases", price: 180, isBorrowed: true },
        { id: 4, name: "Operating Systems", category: "Systems", price: 160, isBorrowed: false },
        { id: 5, name: "Design Patterns", category: "Programming", price: 140, isBorrowed: true },
        { id: 6, name: "Introduction to Probability", category: "Math", price: 110, isBorrowed: false },
        { id: 7, name: "Computer Networks", category: "Systems", price: 135, isBorrowed: true },
        { id: 8, name: "Data Structures", category: "Computer Science", price: 125, isBorrowed: true },
        { id: 9, name: "Modern JavaScript", category: "Programming", price: 95, isBorrowed: true },
        { id: 10, name: "SQL Performance Explained", category: "Databases", price: 150, isBorrowed: false }
    ],
    users: [
        { 
            id: 101, 
            name: "Alice", 
            email: "alice@example.com", 
            password: "hashed_password_101", 
            borrowedBooks: [2, 9] 
        },
        { 
            id: 102, 
            name: "Bob", 
            email: "bob@example.com", 
            password: "hashed_password_102", 
            borrowedBooks: [5, 3] 
        },
        { 
            id: 103, 
            name: "Charlie", 
            email: "charlie@example.com", 
            password: "hashed_password_103", 
            borrowedBooks: [8] 
        },
        { 
            id: 104, 
            name: "Dana", 
            email: "dana@example.com", 
            password: "hashed_password_104", 
            borrowedBooks: [7] 
        },
        { 
            id: 105, 
            name: "Eli", 
            email: "eli@example.com", 
            password: "hashed_password_105", 
            borrowedBooks: [] 
        }
    ],
    loans: [
        { loanId: 1, borrowDate: "2026-09-01", bookId: 2, userId: 101 },
        { loanId: 2, borrowDate: "2026-09-02", bookId: 9, userId: 101 },
        { loanId: 3, borrowDate: "2026-09-05", bookId: 5, userId: 102 },
        { loanId: 4, borrowDate: "2026-09-06", bookId: 3, userId: 102 },
        { loanId: 5, borrowDate: "2026-09-10", bookId: 8, userId: 103 },
        { loanId: 6, borrowDate: "2026-09-11", bookId: 7, userId: 104 }
    ]
};