const express = require('express');
const mongoose = require('mongoose');
require('path');
const router = express.Router();
const Document = mongoose.model('Document');

const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
};

router.get('/documents', isAuthenticated, (req, res) => {
    if (req.query["login_success"] === 'true') {
        res.locals.success = 'Vous êtes maintenant connecté !';
    }

    Document.find().limit(10)
        .then((documents) => {
            console.log(documents);
            res.render('index', {
                title: 'Medialogue', 
                documents,
                user: req.session.user,
                isLoggedIn: !!req.session.user // Ajoute un booléen pour indiquer si l'utilisateur est connecté
            });
        })
        .catch((error) => {
            console.log(`Error fetching documents: ${error.message}`);
            res.status(500).send('Sorry, something went wrong!');
        });
});

module.exports = router;