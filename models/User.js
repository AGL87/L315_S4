const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: String,
    roles: [String],
    borrowedDocuments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
});

userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);