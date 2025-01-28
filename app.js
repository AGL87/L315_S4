const express = require('express');
const routes = require('./routes/index');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//middleware to handle css properly
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

module.exports = app;