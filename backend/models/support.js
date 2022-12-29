const mongoose = require('mongoose');

const Schema = mongoose.Schema

const supportSchema = new Schema({
    tick_subject: String,
    tick_sender_name: String,
    tick_sender_email: String,
    tick_message: String,
    tick_createdBy: String,
    tick_status:{
        type: String, default: 'Open'
    },
    tick_tid: String,
    tick_createdOn: {type: Date, default: Date.now}
});

module.exports = mongoose.model('support', supportSchema);