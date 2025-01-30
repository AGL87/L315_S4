require('dotenv').config();

require('./models/Document');
const User = require('./models/user');
const mongoose = require('mongoose');
const { SecurityService } = require('./services/security_service');

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Création d'un utilisateur admin
async function createAdmin() {  
  const email = 'admin@example.com'; 
  const password = 'admin'; 
  const hashedPassword = SecurityService.hashPassword(password);

  try {
    // Check si l'admin existe déjà
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('Admin existe déjà');
      return; 
    }

    // Si l'admin n'existe pas, on le crée
    const adminUser = new User({
      firstname: 'Admin',
      lastname: 'Admin',
      email: email, 
      password: hashedPassword,
      roles: ['ROLE_ADMIN'], // On lui donne le rôle d'admin
    });

    await adminUser.save();
    console.log('Admin ok');
  } catch (err) {
    console.error('Erreur:', err);
  }
}


  mongoose.connection
  .on('open', () => {
    console.log('Mongoose connection open');
    createAdmin();
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });

const app = require('./app');
const server = app.listen(3000, () => {
  console.log(`Express is running on port ${server.address().port}`);
});
