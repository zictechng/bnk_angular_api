const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const saleProductSchema = new Schema({
  product_name: String,
  product_description: String,
  product_category: String,
  product_sale_price: Number,
  product_qty: Number,
  product_total_amt: Number,
  product_all_total_amt: Number,
  product_id: String,
  product_invoice_id: String,
  product_discount_amt: {
    type: Number,
    default: 0,
  },
  reg_code: String,
  addedby: String,
  product_status: {
    type: String,
    default: "Successful",
  },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("sale_product", saleProductSchema);
