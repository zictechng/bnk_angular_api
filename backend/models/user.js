const mongoose = require('mongoose');

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: String,
    name: String,
    phone: String,
    password: String,
    photo: String
});

module.exports = mongoose.model('user', userSchema);