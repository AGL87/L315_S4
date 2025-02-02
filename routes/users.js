const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Middleware pour vérifier si l'utilisateur est connecté et est administrateur
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.roles.includes('ROLE_ADMIN')) {
    return next();
  }
  res.redirect('/');
};

// Afficher la liste des utilisateurs
router.get('/', isAuthenticated, async (req, res) => {

  // Messages
  if (req.query.newuser_success === 'true') {
    res.locals.success = 'Utilisateur créé avec succès!';
  } else if (req.query.deleteuser_success === 'true') {
    res.locals.success = 'Utilisateur supprimé avec succès!';
  } else if (req.query.deleteuser_error === 'true') {
    res.locals.error = 'Une erreur est survenue lors de la suppression de l\'utilisateur!';
  } else if (req.query.newuser_error === 'true') {
    res.locals.error = 'Une erreur est survenue lors de la création de l\'utilisateur.';
  }

  try {
    const users = await User.find({}, {})
        .sort({
          roles: 1,
        });
    res.render('users', {
      users,
      user: req.session.user,
      title: 'Utilisateurs',
    });
  } catch (err) {
    res.locals.error = "Une erreur est survenue lors de la récupération des utilisateurs. Veuillez réessayer.";
    return res.redirect('/');
  }
});

// Créer un utilisateur
router.post('/create', isAuthenticated, async (req, res) => {
  try {
    const { firstname, lastname, email, password, roles } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ firstname, lastname, email, password: hashedPassword, roles: [roles] });
    await newUser.save();

    res.redirect('/users?newuser_success=true');
  } catch (err) {
    return res.redirect('/users?newuser_error=true');
  }
});

// Supprimer un utilisateur
router.post('/delete', isAuthenticated, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.id);
    res.redirect('/users?deleteuser_success=true');
  } catch (err) {
    return res.redirect("/users?deleteuser_error=true");
  }
});

module.exports = router;
