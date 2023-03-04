const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const buyProductSchema = new Schema({
  product_name: String,
  product_description: String,
  product_category: String,
  product_cost_price: Number,
  product_sale_price: Number,
  product_qty: Number,
  product_code_number: String,
  product_state: String,
  product_expiration_date: String,
  product_buy_date: {
    type: String,
  },
  reg_code: String,
  addedby: String,
  product_status: {
    type: String,
    default: "Pending",
  },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("buy_product", buyProductSchema);
