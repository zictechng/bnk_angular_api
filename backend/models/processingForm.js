const mongoose = require("mongoose");

const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const processingFormSchema = new Schema({
  fname: String,
  lname: String,
  email: String,
  phone: String,
  contact: [{ ca1: Number, ca2: Number, ca3: Number, ca_total: Number }],
  created_by: { type: Schema.Types.ObjectId, ref: "user" }, // this will get the current user ID and save it
  // with the data when creating this details.
  createdOn: { type: Date, default: Date.now },
});

processingFormSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("processingForm", processingFormSchema);
