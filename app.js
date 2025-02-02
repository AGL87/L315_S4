const express = require('express');
const routes = require('./routes/index');
const authRoutes = require("./routes/auth")
const homeRoutes = require("./routes/home")
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const session = require("express-session");
const usersRouter = require('./routes/users');

app.use(express.json());

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
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', homeRoutes);
app.use('/documents', routes);
app.use('/auth', authRoutes);
app.use('/users', usersRouter);


module.exports = app;