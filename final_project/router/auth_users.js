const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if user exists and password matches
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Generate JWT token
  const accessToken = jwt.sign({ username }, "fingerprint_customer", { expiresIn: '1h' });

  // Save token in session
  req.session.authorization = { accessToken };

  return res.status(200).json({ message: "Login successful.", token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  // Check if user is authenticated and username is available from JWT
  if (!req.session || !req.session.authorization) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  let username;
  try {
    const decoded = jwt.verify(req.session.authorization.accessToken, "fingerprint_customer");
    username = decoded.username;
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required as a query parameter." });
  }

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found for the given ISBN." });
  }

  // Add or modify the review for the user
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added/modified successfully.", reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  // Check if user is authenticated and username is available from JWT
  if (!req.session || !req.session.authorization) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  let username;
  try {
    const decoded = jwt.verify(req.session.authorization.accessToken, "fingerprint_customer");
    username = decoded.username;
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found for the given ISBN." });
  }

  // Check if the user's review exists
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No review found for this user to delete." });
  }

  // Delete the user's review
  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully.", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
