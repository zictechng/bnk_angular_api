const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const saveDynamicDataSchema = new Schema({
  type_name: String,
  title_name: String,
  sender_name: String,
  sender_email: String,
  comp_name: String,
  comp_phone: String,
  comp_address: String,
  comp_dynamic: Array,
  picture_image: String,
  addedby: String,
  created_by: { type: Schema.ObjectId, ref: "users" }, // this will get the current user ID and save it
  record_status: {
    type: String,
    default: "Open",
  },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("dynamic_data", saveDynamicDataSchema);
