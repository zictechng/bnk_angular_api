const mongoose = require("mongoose");

const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const processingDynamicDataSchema = new Schema({
  fname: String,
  lname: String,
  email: String,
  phone: String,
  ca1: Number,
  ca2: Number,
  ca3: Number,
  total_amt: Number,
  discount_amt: Number,
  status: {
    type: String,
    default: "Pending",
  },
  created_by: { type: Schema.Types.ObjectId, ref: "user" }, // this will get the current user ID and save it
  // with the data when creating this details.
  createdOn: { type: Date, default: Date.now },
});

processingDynamicDataSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("create_invoice", processingDynamicDataSchema);
