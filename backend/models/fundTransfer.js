const mongoose = require('mongoose');

const Schema = mongoose.Schema

const transferSchema = new Schema({
    acct_name: String,
    acct_number: String,
    swift_code: String,
    amount: String,
    bank_name: String,
    bank_address: String,
    sender_name: String
});

module.exports = mongoose.model('fundtransfer', transferSchema);