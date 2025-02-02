const bcrypt = require("bcrypt");

class SecurityService {

    constructor() {}

    static hashPassword(password) {
        const salt = bcrypt.genSaltSync(12);
        return bcrypt.hashSync(password, salt);
    }

    static comparePasswords(plainPassword, hashedPassword) {
        return bcrypt.compareSync(plainPassword, hashedPassword);
    }


     getAuthenticatedUser(req) {
          // Logique pour vérifier l'authentification de l'utilisateur
          return req.user ? req.user.id : null;
        }
      
}

module.exports = { SecurityService };