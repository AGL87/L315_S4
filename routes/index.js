const express = require('express');
const mongoose= require('mongoose');
const path= require('path');
const { check, validationResult } = require('express-validator');


const router = express.Router();
const Document=mongoose.model('Document');
const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.

router.get('/documents', (req, res) => {
    console.log('route /documents atteinte');
    Document.find().limit(10)
        .then((documents)=>{
            console.log(documents);

      
          res.render('index', {title: 'Medialogue', documents});  
        })
        .catch((error)=>{
      console.log(`Error fetching documents: ${error.message}`);
            res.send('Sorry, something went wrong!');
        });
});

// Route vers le panel admin
router.get('/admin', (req, res) => {
    console.log('route /admin atteinte');
    res.render('admin', {title: 'Admin'});
});

// Route vers le formulaire de création de document
router.get('/newdoc', (req, res) => {
    console.log('route /newdoc atteinte');
    res.render('newdoc', {title: 'New Document'});
});

// Route POST pour ajouter un document
router.post('/newdoc', [
  check('fields[titre_avec_lien_vers_le_catalogue]')
    .isLength({ min: 1 })
    .withMessage('Entrez un titre'),
  check('fields[auteur]')
    .isLength({ min: 1 })
    .withMessage('Entrez un auteur'),
  check('fields[type_de_document]')
    .isLength({ min: 1 })
    .withMessage('Entrez un type de document')
], (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const document = new Document({
      fields: {
        nombre_de_reservations: 0,
        titre_avec_lien_vers_le_catalogue: req.body.fields.titre_avec_lien_vers_le_catalogue,
        auteur: req.body.fields.auteur,
        type_de_document: req.body.fields.type_de_document,
        dispo: req.body.dispo || true,
      },
      record_timestamp: new Date().toISOString(),
    });

    document.save()
      .then(() => {
        res.send('Document ajouté !');
        console.log(document);
      })
      .catch((err) => {
        console.log(err);
        res.send('Oups ! Une erreur est survenue.');
      });
  } else {
    res.render('newdoc', {
      title: 'New Document',
      errors: errors.array(),
      data: req.body,
    });
  }
});

module.exports = router;