const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

let users = require("./auth_users.js").users;

const public_users = express.Router();

const BOOKS_API_URL = "https://openlibrary.org";


// Register a new user
public_users.post('/register', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (users.some(user => user.username === username)) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered"
    });
});


// Get all books
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(
            `${BOOKS_API_URL}/search.json?q=book`
        );

        return res.status(200).json(response.data);

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});


// Get book by ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;

        const response = await axios.get(
            `${BOOKS_API_URL}/isbn/${isbn}.json`
        );

        return res.status(200).json(response.data);

    } catch (error) {
        return res.status(404).json({
            message: "Book not found"
        });
    }
});


// Get books by author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = encodeURIComponent(req.params.author);

        const response = await axios.get(
            `${BOOKS_API_URL}/search.json?author=${author}`
        );

        if (response.data.docs && response.data.docs.length > 0) {
            return res.status(200).json(response.data.docs);
        }

        return res.status(404).json({
            message: "Book not found"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});


// Get books by title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = encodeURIComponent(req.params.title);

        const response = await axios.get(
            `${BOOKS_API_URL}/search.json?title=${title}`
        );

        if (response.data.docs && response.data.docs.length > 0) {
            return res.status(200).json(response.data.docs);
        }

        return res.status(404).json({
            message: "Book not found"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});


module.exports.general = public_users;