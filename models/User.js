const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    datasetid: String,
    recordid: String,
    firstname: String,
    lastname: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    roles: [String],
    borrowedDocuments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
});

userSchema.index({ 'fields.email': 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);