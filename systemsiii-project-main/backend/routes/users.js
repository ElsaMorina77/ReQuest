const express = require("express");
const users = express.Router();
const bcrypt = require('bcrypt');
const db = require("../db/conn");
const multer = require('multer');
const upload = multer(); // for later implementation 
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Set up middleware
users.use(cookieParser());
users.use(session({
    secret: 'your-secret-key', // Change this to a more secure key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Login route
users.post("/login", upload.none(), async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email && password) {
            const user = await db.GetUserByEmail(email);

            if (user) {
                const isMatch = await bcrypt.compare(password, user.password);

                if (isMatch) {
                    req.session.userId = user.id;
                    req.session.userName = user.name;
                    res.status(200).send({ user: { id: user.id, name: user.name }, status: { success: true, msg: "Login successful" } });
                    console.log("User logged in!!");
                } else {
                    res.status(401).send({ status: { success: false, msg: "Invalid credentials" } });
                    console.log("Invalid credentials");
                }
            } else {
                res.status(401).send({ status: { success: false, msg: "User not found" } });
                console.log("User not found");
            }
        } else {
            res.status(400).send({ status: { success: false, msg: "Input element missing" } });
            console.log("A field is missing!");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: { success: false, msg: err.message } });
    }
});

// Register route
users.post("/register", upload.none(), async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const { name, surname, username, email, password } = req.body;
        if (name && surname && username && email && password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const queryResult = await db.AddUser(name, surname, username, email, hashedPassword);
            if (queryResult.affectedRows) {
                res.status(200).send({ status: { success: true, msg: "New user created" } });
                console.log("New user added!!");
            } else {
                res.status(500).send({ status: { success: false, msg: "Failed to create user" } });
                console.log("Failed to add new user.");
            }
        } else {
            res.status(400).send({ status: { success: false, msg: "Input element missing" } });
            console.log("A field is missing!");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: { success: false, msg: err.message } });
    }
});

// Logout route
users.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({ status: { success: false, msg: "Failed to logout" } });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        return res.status(200).send({ status: { success: true, msg: "Successfully logged out" } });
    });
});


users.get('/session', async (req, res, next) => {
    try {
        res.json(req.session)
    } catch (error) {
        res.sendStatus(500)
    }
})


module.exports = users;

