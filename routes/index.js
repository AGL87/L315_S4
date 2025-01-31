const express = require('express');
const mongoose = require('mongoose');
require('path');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const Document = mongoose.model('Document');

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

router.get('/', isAuthenticated, async (req, res) => {
  if (req.query["login_success"] === 'true') {
    res.locals.success = 'Vous êtes maintenant connecté !';
  }

  if (req.query["newdoc_success"] === 'true') {
    res.locals.success = 'Document ajouté !';
  }

  if (req.query["delete_success"] === 'true') {
    res.locals.success = 'Document supprimé avec succès !';
  }

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const totalDocuments = await Document.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    const documents = await Document.find()
        .sort({ record_timestamp: -1 })
        .skip(skip)
        .limit(limit);

    res.render('index', {
      title: 'Medialogue',
      documents,
      user: req.session.user,
      isLoggedIn: !!req.session.user,
      currentPage: page,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: totalPages
    });
  } catch (error) {
    console.log(`Error getting documents: ${error.message}`);
    res.status(500).send('Une erreur est survenue lors de la récupération des documents !');
  }
});


// Route vers le formulaire de création de document
router.get('/new', (req, res) => {
  console.log('route /documents/new atteinte');
  res.render('newdoc', { title: 'New Document' });
});

// Route POST pour ajouter un document
router.post('/new', [
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
        res.redirect('/documents?newdoc_success=true');
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

// Route pour supprimer un document
router.post('/delete', async (req, res) => {
  try {
    const documentId = req.body.id;
    await Document.findByIdAndDelete(documentId);

    res.redirect('/documents?delete_success=true');
  } catch (error) {
    console.error(`Oups: ${error.message}`);
  }
});

module.exports = router;