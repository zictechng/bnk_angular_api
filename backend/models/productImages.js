const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  product_name: String,
  product_id: String,
  product_photo: String,
  product_image_des: String,
  product_image_path: String,
  addedby: String,
  product_reg_id: String,
  status: {
    type: String,
    default: "List",
  },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("product", productSchema);
