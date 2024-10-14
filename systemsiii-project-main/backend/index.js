const express = require("express");
const dotenv = require("dotenv");
const session = require('express-session');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const path = require('path');


dotenv.config();
const app = express();
const port = process.env.PORT || 8835;


app.use(express.static(path.join(__dirname, "build")));

app.use(cookieParser());

app.use(session({
    secret: 'our little secret', // Change to a more secure secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
    //cookie: { secure: process.env.NODE_ENV === 'production' } // Secure cookies in production
}));



app.use(express.urlencoded({ extended: true }));
app.use(cors({
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    credentials: true,
    //origin: ['http://localhost:3000', 'http://localhost:3001', 'http://88.200.63.148:3000' , 'http://88.200.63.148:3001']
}));

app.use(express.json());


// Routes
const novice = require("./routes/novice");
const users = require("./routes/users");
const search = require("./routes/search");
//const token = require("./routes/token");




app.use("/novice", novice);
app.use("/users", users);
app.use("/search", search);
//app.use("/token", token);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});



app.use((req, res, next) => {
    if (req.session.userId) {
      req.user = { id: req.session.userId };
      console.log('User authenticated:', req.user); // Debug log
    } else {
      req.user = null;
      console.log('No user authenticated'); // Debug log
    }
    next();
  });


  /*app.post('/users/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Logout failed');
      }
      res.clearCookie('connect.sid'); // Replace 'connect.sid' with your session cookie name if different
      res.send('Logout successful');
    });
  });*/
  

app.listen(port, () => {
    console.log("Successfully running on port " + port);
});
