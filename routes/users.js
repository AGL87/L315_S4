const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Afficher la liste des utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.render('users', { users });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

// Créer un utilisateur
router.post('/create', async (req, res) => {
  try {
    const { firstname, lastname, email, password, roles } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ firstname, lastname, email, password: hashedPassword, roles: [roles] });
    await newUser.save();
    res.redirect('/users');
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

// Supprimer un utilisateur
router.post('/delete', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.id);
    res.redirect('/users');
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
