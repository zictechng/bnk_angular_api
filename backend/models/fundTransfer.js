const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema

const transferSchema = new Schema({
    acct_name: String,
    acct_number: String,
    swift_code: String,
    amount: Number,
    bank_name: String,
    bank_address: String,
    sender_name: String,
    tran_type: String,
    transac_nature: String,
    tran_desc: String,
    trans_balance: Number,
    tr_year: String,
    colorcode: String,
    createdBy: String,
    transaction_status:{
        type: String, default: 'Pending'
    },
    tid: String,
    checked: Boolean,
    //createdBy: {type: Schema.Types.ObjectId, ref: 'user'}, // this will get the current user ID and save it 
    // with the data when creating this details.
    createdOn: {type: Date, default: Date.now},
});

transferSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('fundtransfer', transferSchema);