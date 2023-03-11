const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const saveDynamicDataSchema = new Schema({
  type_name: String,
  title_name: String,
  sender_name: String,
  sender_email: String,
  company_name: String,
  company_phone: String,
  company_address: String,
  picture_image: String,
  addedby: String,
  record_status: {
    type: String,
    default: "Open",
  },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("dynamic_data", saveDynamicDataSchema);
