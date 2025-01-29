const mongoose = require('mongoose');
const User= mongoose.model('User');
const { MongoClient } = require("mongodb");

class UserDbService {
    constructor() {}

    async fetchUsers() {}

    async createUser(user) {
        try {
            await User.create(user);
            return {
                status: 201,
                message: 'User created successfully',
            };
        } catch (error) {
            return {
                status: 500,
                message: error.message,
            };
        }
    }

    async updateUser(user) {}
    async deleteUser(id) {}
    async getUserById(id) {}

    async getUserByEmail(email) {
        try {
            return await User.findOne({
                email: email
            }, {
                _id: 1,
                firstname: 1,
                lastname: 1,
                email: 1,
                roles: 1,
                password: 1
            });
        } catch (error) {
            throw new Error('Error fetching user by email: ' + error.message);
        }
    }
}

module.exports = { UserDbService };