const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if username already exists
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists. Please choose another." });
  }

  // Register the new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Return the list of all books in a neat JSON format
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found for the given ISBN." });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];
  // Iterate through all books and find those with the matching author
  Object.keys(books).forEach(isbn => {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push({ isbn, ...books[isbn] });
    }
  });
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found for the given author." });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];
  // Iterate through all books and find those with the matching title
  Object.keys(books).forEach(isbn => {
    if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push({ isbn, ...books[isbn] });
    }
  });
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found for the given title." });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found for the given ISBN." });
  }
});

// Get the book list available in the shop using async/await with Axios
public_users.get('/async-books', async function (req, res) {
  try {
    // Simulate an async call to get books (could be to an external API or internal endpoint)
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        // Simulate async operation
        setTimeout(() => {
          resolve(books);
        }, 100);
      });
    };
    const allBooks = await getBooks();
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving books', error: error.message });
  }
});

// Get book details based on ISBN using async/await with Axios
public_users.get('/async-isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    // Simulate an async call to get book by ISBN
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject(new Error('Book not found for the given ISBN.'));
          }
        }, 100);
      });
    };
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book details based on author using async/await with Axios
public_users.get('/async-author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    // Simulate an async call to get books by author
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const matchingBooks = [];
          Object.keys(books).forEach(isbn => {
            if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
              matchingBooks.push({ isbn, ...books[isbn] });
            }
          });
          if (matchingBooks.length > 0) {
            resolve(matchingBooks);
          } else {
            reject(new Error('No books found for the given author.'));
          }
        }, 100);
      });
    };
    const booksByAuthor = await getBooksByAuthor(author);
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book details based on title using async/await with Axios
public_users.get('/async-title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    // Simulate an async call to get books by title
    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const matchingBooks = [];
          Object.keys(books).forEach(isbn => {
            if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
              matchingBooks.push({ isbn, ...books[isbn] });
            }
          });
          if (matchingBooks.length > 0) {
            resolve(matchingBooks);
          } else {
            reject(new Error('No books found for the given title.'));
          }
        }, 100);
      });
    };
    const booksByTitle = await getBooksByTitle(title);
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

module.exports.general = public_users;
