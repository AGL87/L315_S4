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
}

module.exports = { SecurityService };