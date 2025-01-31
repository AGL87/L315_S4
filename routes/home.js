const express = require('express');
const mongoose = require('mongoose');
const Document = mongoose.model('Document');

const router = express.Router();

router.get('/', async (req, res) => {
    if (req.query["login_success"] === 'true') {
        res.locals.success = 'Vous êtes maintenant connecté !';
    }

    if (req.query["logout_success"] === 'true') {
        res.locals.success = 'Vous êtes maintenant déconnecté !';
    }

    try {
        const documents = await Document.find()
            .sort({ record_timestamp: -1 })
            .limit(5)
        ;

        res.render('home', {
            title: 'Medialogue',
            user: req.session.user,
            documents });
    } catch (error) {
        console.error(`Error fetching documents: ${error.message}`);
        return res.status(500).send('Une erreur est survenue lors de la récupération des documents!');
    }
});

module.exports = router;