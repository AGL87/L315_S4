require('dotenv').config();

require('./models/Document');
const User = require('./models/User');
const mongoose = require('mongoose');
const { UserDbService } = require('./services/user_db_service');
const { SecurityService } = require('./services/security_service');

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Création d'un utilisateur admin
async function createAdmin() {  
  const email = 'admin@example.com'; // Set the admin email
  const password = 'admin'; // Set the admin password
  const hashedPassword = SecurityService.hashPassword(password); // Hash the password

  try {
    // Check if the admin already exists
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('Admin already exists.');
      return; // Exit if the admin already exists
    }

    // Log the email and other details for debugging
    console.log('Creating admin user with email:', email);

    // If no admin exists, create a new one
    const adminUser = new User({
      firstname: 'Admin',
      lastname: 'Admin',
      email: email, // Make sure this is not null
      password: hashedPassword,
      roles: ['ROLE_ADMIN'], // Assign the admin role
    });

    // Check before saving if the email is null or undefined
    if (!adminUser.email) {
      console.error('Email is not set properly!');
      return;
    }

    await adminUser.save(); // Save the new admin user to the database
    console.log('Admin user created!');
  } catch (err) {
    console.error('Error creating admin:', err);
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
