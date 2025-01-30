const express = require('express');
const routes = require('./routes/index');
const authRoutes = require("./routes/auth")
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const session = require("express-session");

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware pour le css
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);
app.use('/auth', authRoutes);


module.exports = app;