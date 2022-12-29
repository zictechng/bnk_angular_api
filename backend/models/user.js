const mongoose = require('mongoose');

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: String,
    name: String,
    phone: String,
    password: String,
    photo: String,
    acct_cot:  String,
    acct_imf_code: String,
    acct_pin: String,
    acct_status: String,
    amount: Number,
    acct_type: String,
    acct_balance: Number,
    country: String,
    acct_number: Number,
    dob: String,
    last_transaction: Number,
    address: String,
    user_role:{
        type: String, default: 'User'
    },
    createdOn: {type: Date, default: Date.now}
});

module.exports = mongoose.model('user', userSchema);